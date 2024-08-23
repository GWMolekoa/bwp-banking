import RightSidebar from "@/components/RightSidebar";
import TotalBalanceBox from "@/components/TotalBalanceBox";
import HeaderBox from "@/components/ui/HeaderBox"

const Dashboard = () => {
    const loggedIn = {firstName: "Gaopalelwe", lastName: "Molekoa", email: "gwmolekoa@gmail.com" }; 

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
                        accounts={[]}
                        totalBanks={1}
                        totalCurrentBalance={1250.35}
                    
                    />

                </header>

                RECENT TRANSACTIONS
            </div>

            <RightSidebar 
               user={loggedIn}
               transactions={[]}
               banks={[{ currentBalance: 39994.50 }, {currentBalance: 4594.50}]}   
            />
        </section>
    )
}

export default Dashboard