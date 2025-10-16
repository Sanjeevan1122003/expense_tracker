import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { ThreeDots } from 'react-loader-spinner'
import "../styles/pagesstyle.css";
import navLogo from "../assets/dashboard_logo.png";
import homeLogo from "../assets/expence_tracker_home_page.png";
import logo from "../assets/Logo.png";
import ExpenseCharts from './ExpenseCharts'
import AddExpense from './AddExpense';
import UpdateExpense from './UpdateExpense';
import DeleteForm from './DeleteForm';

const Dashboard = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [chartType, setChartType] = useState('combined');
  const [filterType, setFilterType] = useState('all');
  const [filterValue, setFilterValue] = useState('');
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  // Function to format date to DD-MM-YYYY
  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const token = Cookies.get("jwt_token");
  const email = token ? jwtDecode(token).email : null;

  // Fetch user data with filters
  const fetchUserData = useCallback(async (filters = {}) => {
    try {
      const queryParams = new URLSearchParams({ email, ...filters });
      const res = await axios.get(`https://expense-tracker-wheat-six-61.vercel.app/dashboard?${queryParams}`);
      setUserData(res.data);
      setExpenses(res.data.expenses || []);
      setFilteredExpenses(res.data.expenses || []);
    } catch (err) {
      console.error("Error fetching user data:", err);
      navigate("/login");
    } finally {
      setLoading(false);
    }
  }, [email, navigate]);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [token, fetchUserData, navigate]);

  if (!token) {
    return null; // Optional fallback
  }

  if (loading || !userData) {
    return (<div className="loader-container">
      <ThreeDots
        visible={true}
        height="50"
        width="50"
        color="#0b69ff"
        ariaLabel="three-dots-loading"
      />
    </div>
    );
  }



  // Apply filters
  const applyFilters = () => {
    let filters = {};
    if (filterType !== 'all') {
      filters.filterType = filterType;
      if (filterType === 'specificDate' && filterValue) {
        filters.startDate = filterValue;
      } else if (filterType === 'month' && filterValue) {
        filters.startDate = filterValue; // YYYY-MM
      } else if (filterType === 'year' && filterValue) {
        filters.startDate = filterValue; // YYYY
      } else if (filterType === 'lastDays' && filterValue) {
        filters.days = filterValue;
      } else if (filterType === 'lastMonths' && filterValue) {
        filters.months = filterValue;
      }
    }
    fetchUserData(filters);
  };

  // Generate PDF
  const handleDownloadPDF = () => {
    if (!filteredExpenses.length) {
      alert("No expenses to generate PDF.");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Expense Report", 14, 15);

    const headers = [["ID", "Category", "Type(Expense/Income)", "Amount", "Date"]];
    const data = filteredExpenses.map((exp, index) => [
      index + 1,
      exp.category,
      exp.type,
      exp.amount,
      formatDate(exp.date)
    ]);

    autoTable(doc, {
      startY: 20,
      head: headers,
      body: data,
      theme: "grid",
      styles: { halign: "center" },
      headStyles: { fillColor: [0, 153, 255] },
    });

    doc.save("expenses.pdf");
  };

  const onClickLogout = () => {
    Cookies.remove("jwt_token");
    return navigate('/login')
  };


  return (
    <div className="dashboard-content">
      {userData ? (
        <>
          <div className="dashboard-nav-container">
            <nav className="dashboard-navbar">
              <div className="dashboard-logo">
                <img src={navLogo} alt="Logo" className="logo" />
              </div>
              <div className="dashboard-buttons">
                <button className="dashboard-button"><a href="#sectionHome">Home</a></button>
                <button className="dashboard-button"><a href="#sectionExpense">Expenses</a></button>
                <button className="dashboard-button"><a href="#sectionData">Your Data</a></button>
                <button className="dashboard-button" onClick={onClickLogout}>Logout</button>
              </div>
            </nav>
          </div>
          <section id="sectionHome">
            <div className="home-content">
              <div className="home-container">
                <div className="home-card">
                  <div className="home-card-description">
                    <h1 className="home-title">Hi, <span className="highlights">{userData.username}</span></h1>
                    <h2 className="home-title">Welcome to <span className="highlights">Expense Tracker</span> Dashboard</h2>
                    <h3 className="home-title">Track your Expenses Easily</h3>
                    <p className="home-description">Manage your daily expenses efficiently and take control of your
                      financial health.</p>
                    <ul className="home-description">
                      <li>➕ Add your daily expenses</li>
                      <li>📈 View spending insights</li>
                      <li>💰 Set monthly budgets</li>
                      <li>🔔 Get expense alerts</li>
                    </ul>
                  </div>
                  <div className="home-card-image">
                    <img src={homeLogo} alt="Logo" className="home-image" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="sectionExpense">
            <div className="expense-content">
              <div className="expense-cards">
                <AddExpense onSuccess={fetchUserData} />
                <UpdateExpense onSuccess={fetchUserData} />
                <DeleteForm onSuccess={fetchUserData} />
              </div>
            </div>
          </section>
          <section id="sectionData">
            <div className="data-content">
              <div className="data-container">
                <div className="data-cards">
                  <div className="data-top-cards">
                    <div className="data-top-card">
                      <h3>Total Income: ₹<b className="highlights">{userData.totalIncome}</b></h3>
                    </div>
                    <div className="data-top-card">
                      <h3>Total Expense: ₹<b className="highlights" >{userData.totalExpense}</b></h3>
                    </div>
                    <div className="data-top-card">
                      <button onClick={handleDownloadPDF} disabled={loading} >Download PDF 📄</button>
                    </div>
                  </div>
                  <div className="filter-section data-top-cards">
                    <div className="data-top-card">
                      <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
                        <option value="all">All Data</option>
                        <option value="specificDate">Specific Date</option>
                        <option value="month">Month</option>
                        <option value="year">Year</option>
                        <option value="lastDays">Last N Days</option>
                        <option value="lastMonths">Last N Months</option>
                      </select>
                    </div>
                    {filterType === 'specificDate' && (
                      <div className="data-top-card">
                        <input type="date" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                      </div>
                    )}
                    {filterType === 'month' && (
                      <div className="data-top-card">
                        <input type="month" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                      </div>
                    )}
                    {filterType === 'year' && (
                      <div className="data-top-card">
                        <input type="number" placeholder="Year" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                      </div>
                    )}
                    {filterType === 'lastDays' && (
                      <div className="data-top-card">
                        <input type="number" placeholder="Days" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                      </div>
                    )}
                    {filterType === 'lastMonths' && (
                      <div className="data-top-card">
                        <input type="number" placeholder="Months" value={filterValue} onChange={(e) => setFilterValue(e.target.value)} />
                      </div>
                    )}
                    <div className="data-top-card">
                      <button onClick={applyFilters}>Apply Filter</button>
                    </div>
                  </div>
                  <div className="data-bottom-card">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Category</th>
                          <th>Type(Expense/Income)</th>
                          <th>Amount</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userData.expenses.map((exp) => (
                          <tr key={exp.id}>
                            <td>{exp.user_expense_id}</td>
                            <td>{exp.category}</td>
                            <td>{exp.type}</td>
                            <td>₹ {exp.amount}</td>
                            <td>{formatDate(exp.date)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section id="sectionChart">
            <div className="data-content">
              <div className="data-container">
                <div className="data-cards">
                  <div className="chart-selector data-top-cards">
                    <div className="data-top-card">
                      <button onClick={() => setChartType('income')} className={chartType === 'income' ? 'active' : ''}>Income Charts</button>
                    </div>
                    <div className="data-top-card">
                      <button onClick={() => setChartType('expense')} className={chartType === 'expense' ? 'active' : ''}>Expense Charts</button>
                    </div>
                    <div className="data-top-card">
                      <button onClick={() => setChartType('combined')} className={chartType === 'combined' ? 'active' : ''}>Combined Charts</button>
                    </div>
                  </div>
                </div>
                <div className="data-card">
                  <ExpenseCharts expenses={expenses} chartType={chartType} />
                </div>
              </div>
            </div>
          </section>
          <div className="footer">
            <p>&copy; 2025 Expense Tracker </p> <img src={logo} alt="footor-logo" />
          </div>
        </>
      ) : <div className="loader-container">
        <ThreeDots
          visible={true}
          height="50"
          width="50"
          color="#0b69ff"
          ariaLabel="three-dots-loading"
        />
      </div>}
    </div>
  );
};

export default Dashboard;
