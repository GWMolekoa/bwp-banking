import RecentTransactions from "@/components/RecentTransactions";
import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import HeaderBox from "@/components/ui/HeaderBox";
import { getAccount, getAccounts } from "@/lib/actions/bank.actions";
import { getLoggedInUser } from "@/lib/actions/user.actions";  // Import the function correctly

const Home = async ({ searchParams: { id, page } }: SearchParamProps ) => {
    const currentPage = Number(page as string) || 1;

    // Fetch the logged-in user
    const loggedIn =  await getLoggedInUser(); 
    console.log("Logged in user:", loggedIn);  // Log the user details for debugging

    // Check if the user is logged in
    if (!loggedIn) {
        console.error("No user logged in. Please check your authentication flow.");
        return;
    }

    // Fetch accounts associated with the logged-in user
    const accounts = await getAccounts({ userId: loggedIn.$id });

    if (!accounts) return;

    const accountsData = accounts?.data;
    const appwriteItemId = (id as string) || accountsData[0]?.apprwriteItemId;

    // Fetch account details
    const account = await getAccount({ appwriteItemId });

    return (
        <section className="home">
            <div className="home-content">
                <header className="home-header">
                    <HeaderBox 
                        type="greeting"
                        title="Welcome"
                        user={loggedIn?.firstName || 'Guest'}
                        subtext="Access And Manage Your Account And Transactions Efficiently"
                    />

                    <TotalBalanceBox 
                        accounts={accountsData}
                        totalBanks={accounts?.totalBanks}
                        totalCurrentBalance={accounts?.totalCurrentBalance}
                    />
                </header>

                <RecentTransactions 
                    accounts={accountsData}
                    transactions={account?.transactions}
                    appwriteItemId={appwriteItemId}
                    page={currentPage}
                />
            </div>

            <RightSidebar 
                user={loggedIn}
                transactions={account?.transactions}
                banks={accountsData?.slice(0, 2)}
            />
        </section>
    );
};

export default Home;
