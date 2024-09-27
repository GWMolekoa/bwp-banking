'use server'

import { ID, Query } from "node-appwrite";
import { createAdminClient, createSessionClient } from "../appwrite";
import { cookies } from "next/headers";
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils";
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid";
import { plaidClient } from "@/lib/plaid";
import { revalidatePath } from "next/cache";
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions";

const {
    APPWRITE_DATABASE_ID: DATABASE_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_COLLECTION_ID,
} = process.env;

export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
        const { database } = await createAdminClient();

        //check errors
        console.log('Fetching user info for userId:', userId);

        const user = await database.listDocuments(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            [Query.equal('userId', [userId])]
        );

        // Add logging to check if the correct user data is retrieved
        console.log('User query result:', user);

        return parseStringify(user.documents[0]);
      } catch (error) {
        // Log the actual error in more detail
        console.error('Error in getUserInfo:', error);
    }
};

export const signIn = async ({ email, password }: signInProps) => {
    try {
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
  });

        const user = await getUserInfo({ userId: session.userId})
        
        return parseStringify(Response); 
    } catch (error) {
        console.error('Error', error);
    }
}

export const signUp = async ({password, ...userData}: SignUpParams) => {
    const { email, firstName, lastName } = userData;

    try {
        const { account, database } = await createAdminClient();

        // Log email and other data before user creation
        console.log('Creating account for email:', email);

        const newUserAccount = await account.create(ID.unique(), email, password, `${firstName} ${lastName}`);
        
        if(!newUserAccount) throw new Error('Error creating user');

        // Log newly created user account details
        console.log('New user account created:', newUserAccount);

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: 'personal'
        });

        if(!dwollaCustomerUrl) throw new Error('Error creating Dwolla customer');

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);

        // Log data before creating the new document
        console.log('Creating new document for user:', {
            userId: newUserAccount.$id,
            dwollaCustomerId,
            dwollaCustomerUrl
        });

        const newUser = await database.createDocument(
            DATABASE_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerId,
                dwollaCustomerUrl
            }
        );

        console.log('New user document created:', newUser);

        const session = await account.createEmailPasswordSession(email, password);

        // Log session details
        console.log('New session created for user:', session);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return parseStringify(newUser);

    } catch (error) {
        console.error('Error in signUp:', error);
    }
};

export async function getLoggedInUser() {
    try {
      const { account } = await createSessionClient();
      const result = await account.get();

      const user = await getUserInfo({ userId: result.$id})

      return parseStringify(user);
    } catch (error) {
      return null;
    }
  }

export const logoutAccount = async () => {
    try {
        const { account } = await createSessionClient ();

        cookies().delete('appwrite-session');

        await account.deleteSession('current');
    } catch (error) {
        return null;
    }
}
  
export const createLinkToken = async (user: User) => {
   try {
    const tokenParams = {
        user:{
            client_user_id: user.$id
        },
        client_name: `${user.firstName} ${user.lastName}`,
        products: ['auth'] as Products[],
        language: 'en',
        country_codes: ['US'] as CountryCode[],   
    }

    const response = await plaidClient.linkTokenCreate(tokenParams);

    return parseStringify({ linkToken: response.data.link_token})
   } catch (error) {
    console.log(error);
   }
}

export const createBankAccount = async ({
    userId,
    bankId,
    accountId,
    accessToken,
    fundingSourceUrl,
    shareableId,
}: createBankAccountProps) => {
    try {
        const { database } = await createAdminClient();

        const bankAccount = await database.createDocument(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accountId,
                accessToken,
                fundingSourceUrl,
                shareableId,   
            }
        )

        return parseStringify(bankAccount);
    } catch (error) {
        
    }
}

export const exchangePublicToken = async ({
    publicToken,
    user,
}: exchangePublicTokenProps) => {
    try {
        console.log('Exchanging public token:', publicToken);

        const response = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken,
        });

        const accessToken = response.data.access_token;
        const itemId = response.data.item_id;

        console.log('Access token received:', accessToken);
        console.log('Item ID received:', itemId);

        const accountsResponse = await plaidClient.accountsGet({
            access_token: accessToken,
        });

        const accountData = accountsResponse.data.accounts[0];
        console.log('Account data:', accountData);

        const request: ProcessorTokenCreateRequest = {
            access_token: accessToken,
            account_id: accountData.account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,
        };

        const processorTokenResponse = await plaidClient.processorTokenCreate(request);
        const processorToken = processorTokenResponse.data.processor_token;

        console.log('Processor token:', processorToken);

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken,
            bankName: accountData.name,
        });

        if (!fundingSourceUrl) throw new Error('Error creating funding source URL');
        console.log('Funding source URL:', fundingSourceUrl);

        await createBankAccount({
            userId: user.$id,
            bankId: itemId,
            accountId: accountData.account_id,
            accessToken,
            fundingSourceUrl,
            shareableId: encryptId(accountData.account_id)
        });

        revalidatePath("/");

        return parseStringify({
            publicTokenExchange: "complete",
        });

    } catch (error) {
        console.error("Error in exchangePublicToken:", error);
    }
};


export const getBanks = async ({ userId }:
    getBanksProps) => {
      try {
        const { database } = await createAdminClient();

        const banks = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal(`userId`, [userId])]
        );

        return parseStringify(banks.documents);
      } catch (error) {
        console.log(error)
      }  
    }

    export async function getBank({ documentId }: getBankProps) {
    try {
        const { database } = await createAdminClient();;

        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal(`$id`, [documentId])]
        );

        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.log(error);
    }
};

export async function getBankByAccountId({ accountId }: getBankByAccountIdProps) {
    try {
        const { database } = await createAdminClient();;

        const bank = await database.listDocuments(
            DATABASE_ID!,
            BANK_COLLECTION_ID!,
            [Query.equal('accountId', [accountId])]
        )

        if(bank.total !== 1) return null;

        return parseStringify(bank.documents[0]);
    } catch (error) {
        console.log(error);
    }
};
