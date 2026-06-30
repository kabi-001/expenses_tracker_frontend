import "../style/home.css";

function Home() {
  return (
    <>
      <nav className="navbar">
        <div className="logo">ExpenseFlow</div>

        <ul className="nav-links">
          <li>Home</li>
          <li>Features</li>
          <li>Analytics</li>
          <li>Contact</li>
        </ul>

        <button className="login-btn">Login</button>
      </nav>

      <section className="hero">
        <div className="hero-left">
          <span className="badge">💰 Smart Expense Tracking</span>

          <h1>
            Track Every <span>Rupee</span>.
            <br />
            Control Every <span>Expense</span>.
          </h1>

          <p>
            Manage your income, expenses, budgets and financial goals
            with powerful insights and analytics.
          </p>

          <div className="hero-buttons">
            <button className="primary-btn">
              Get Started Free
            </button>

            <button className="secondary-btn">
              View Dashboard
            </button>
          </div>
        </div>

        <div className="hero-right">
          <div className="dashboard-card">
            <div className="card-row">
              <div className="mini-card income">
                <h3>Income</h3>
                <p>₹70,000</p>
              </div>

              <div className="mini-card expense">
                <h3>Expense</h3>
                <p>₹25,000</p>
              </div>
            </div>

            <div className="chart-box">
              📊 Income vs Expense Chart
            </div>

            <div className="transactions">
              <h4>Recent Transactions</h4>

              <div className="transaction">
                <span>Food</span>
                <span>- ₹250</span>
              </div>

              <div className="transaction">
                <span>Salary</span>
                <span>+ ₹15,000</span>
              </div>

              <div className="transaction">
                <span>Petrol</span>
                <span>- ₹500</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>  
  );
}

export default Home;