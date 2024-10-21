This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## How To Use BWP (Bank With PvleTheEngineer)
The application is currently in sandbox(testing) mode. 

1) Before you start, Click "Sign Up". You'll be re-directed to a sign up form.

2) On the sign up form fill out your details. Kindly note, the app uses a Plaid- and Dwolla API which contain mostly US Banks to connect and facilitate transactions. So for ease of use, testing and the onboarding process for documentation, a few states have been hardcoded. Please also ensure when filling out the postal code to input 5-digits.

3) When done, click on "Sign Up". You'll be directed to a "Connect Bank" page where you can begin the onboarding process.
    
4) Click "Connect Bank" to get started. Plaid will pop up on screen, click "Continue".

5) Select your bank of choice "Chase, Bank of America, Wells Fargo etc.,). Click "Continue to Login".

6) A window (First Platypus Bank, which is an AuthPage) will pop up. You'll be requested to Sign in. Please use the following details to perform this action:
- Username: user_good
- Password: pass_good

When done, click "Sign in".

7) Select "Get code" and type 0000. Click "Submit". You will be redirected to a "Connect account information" page where you'll select accounts.

8) Select the first account "Plaid Checking" and scroll to bottom of the window where you'll tick two boxes. Click "Continue" after. You will be redirected to an account confirmation page. Scroll to the bottom of the window and tick the box. Click "Connect account information" when done.

9) When the process is complete, the window will disappear and plaid will pop once more with a message of confirmation that your account has been successfully linked. Click "Continue". Wait a few seconds and you'll be redirected to the home page where you can view your accounts dashboard. 

## Navigating The App
The page is divided into three sections as follows:
- A Left-Sidebar where you'll be able to navigate to 'Home'(accounts dashboard), 'My Banks' (where you can view connected accounts), 'Transaction History'(view all transactions for a specific account) 'Transfer Funds' (to perform transactions) and lastly 'Connect Bank' to add accounts. 

- An interactive dashboard with a chart, and transactions table displaying all transactions for your account(s). 

- A Right-Sidebar displaying the logged-in user's details, their connected bank account displayed as a card and a categories section below to display the transaction types, i.e Transfer, Travel, Food etc.

# To View Transactions
- When you sign in, the a list of transactions will appear on the transactions table on the dashboard when toggling accounts(if there's more than one). However, to view the full transaction history of the account, Click on the card on the Right-Sidebar and you will be directed to the 'Transaction History' page where you'll see all transactions on the account.

- Alternatively, you can navigate to 'My Banks' where your accounts will be displayed. Click on the account(or card) of your choice and you'll be directed to the 'Transactions History' page of the account.

# To Perform A Transaction
- To see this app work in real-time and perform a transaction between accounts, we must add an additional account.
- On the Left-Sidebar, Click on "Connect Bank" and you'll perform the same procedure as outlined in steps 4-9. Wait a few seconds and the dashboard will reload with your additional account. 

- When the process is complete, navigate to "My Banks" where your accounts will be displayed. You will notice below each card is a sharable ID. This sharable ID will be used to direct funds from one account to the other. For example, to move funds from "Plaid Saving" to "Plaid Checking" you must copy the sharable ID of "Plaid Checking". Conversely to move funds from "Plaid Checking" to "Plaid Saving", you must copy the sharable ID of "Plaid Saving" as this will be required on the 'Tranfer Funds' page. 

- After copying the sharable ID of the account to which you'll move funds, navigate to the "Transfer Funds" page where you'll fill out a form.

- "Select Your Source Bank". For example if you are transferring funds from "Plaid Saving" to "Plaid Checking" your source bank will be "Plaid Saving".

- Proceed to fill out the form. Under "Bank account details" provide the details of the reciepient by entering their email(in this case, our own since we're making transfers between same user accounts), and pasting the sharable ID of the account we want to tranfer funds to in the "Receiver's Plaid Sharable Id'. This will be the sharable Id of "Plaid Checking".

- Enter the amount you'd like to transfer for example '50.00'. Please ensure you type the value in this format '0.00' otherwise the transaction won't go through. When done, click "Transfer Funds", wait a few seconds and you'll be redirected to the dashboard where the transaction will be visible on the transactions table.

Please note the transaction will appear on the transaction table as "processing" from the debited account(Plaid Saving) and will reflect on the other account(Plaid Checking) within 24-48hrs.

Enjoy the app.              
