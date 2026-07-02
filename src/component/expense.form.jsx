import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../style/expenseForm.css";
import { useNavigate } from "react-router-dom";
import { ENV } from "../config/env";

function Expense() {
  const [expenses, setExpenses] = useState([]);
  const [allExpenses, setAllExpenses] = useState([]); // For totals calculation
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [filterAmount, setFilterAmount] = useState("");
  const [debouncedAmount, setDebouncedAmount] = useState("");
  const [search, setsearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "",
    type: "",
    description: "",
    date: "",
    image: null,
  });

  const categories = [
    { value: "food", label: "Food" },
    { value: "travel", label: "Travel" },
    { value: "shopping", label: "Shopping" },
    { value: "bills", label: "Bills" },
    { value: "health", label: "Health" },
    { value: "education", label: "Education" },
    { value: "entertainment", label: "Entertainment" },
    { value: "rent", label: "Rent" },
    { value: "electricity", label: "Electricity" },
    { value: "internet", label: "Internet" },
    { value: "medical", label: "Medical" },
    { value: "other", label: "Other" },
  ];

  const getAuthHeader = () => {
    const token = localStorage.getItem("auth_token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const filteredExpenses = expenses.filter((item) => {
    if (
      filterCategory &&
      item.category.toLowerCase() !== filterCategory.toLowerCase()
    ) {
      return false;
    } else if (
      filterDate &&
      new Date(item.date).toISOString().split("T")[0] !== filterDate
    ) {
      return false;
    } else if (filterAmount && Number(item.amount) !== Number(filterAmount)) {
      return false;
    } else if (
      search &&
      !item.title.toLowerCase().includes(search.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Fetch paginated expenses for table display
  const getExpenses = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${ENV.Backend_API}/expense/all`, {
        headers: getAuthHeader(),
        params: {
          ...{
            category: filterCategory,
            date: filterDate,
            amount: filterAmount,
            title: search,
            limit: 5,
            page: currentPage,
          },
        },
      });
      setExpenses(Array.isArray(res.data?.expenses) ? res.data.expenses : []);
      setCurrentPage(res.data?.currentPage || 1);
      setTotalPages(res.data?.totalPages || 1);
    } catch (error) {
      toast.error("Failed to fetch expenses");
      setExpenses([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all expenses without pagination for totals calculation
  const getAllExpensesForTotals = async () => {
    try {
      const res = await axios.get(`${ENV.Backend_API}/expense/all`, {
        headers: getAuthHeader(),
        params: { limit: 10000, page: 1 }, // Fetch all records at once
      });
      setAllExpenses(
        Array.isArray(res.data?.expenses) ? res.data.expenses : [],
      );
    } catch (error) {
      console.log(error)
      console.log("Failed to fetch totals");
    }
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setDebouncedAmount(filterAmount);
    }, 500);

    return () => clearTimeout(timer);
  }, [search, filterAmount]);

  // Fetch paginated data when filters or page changes
  useEffect(() => {
    getExpenses();
  }, [
    filterCategory,
    filterDate,
    debouncedSearch,
    debouncedAmount,
    currentPage,
  ]);

  // Fetch all expenses for totals on component mount
  useEffect(() => {
    getAllExpensesForTotals();
  }, []);

  const addExpense = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("amount", formData.amount);
      data.append("category", formData.category);
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("date", formData.date);

      if (formData.image) {
        data.append("image", formData.image);
      }

      await axios.post(`${ENV.Backend_API}/expense/add`, data, {
        headers: {
          ...getAuthHeader(),
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Expense added successfully");
      resetForm();
      getExpenses();
      getAllExpensesForTotals();
    } catch (error) {
      console.log(error);
      toast.error("Failed to add expense");
    }
  };

  const updateExpense = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("amount", formData.amount);
      data.append("category", formData.category);
      data.append("type", formData.type);
      data.append("description", formData.description);
      data.append("date", formData.date);

      if (formData.image instanceof File) {
        data.append("image", formData.image);
      }

      await axios.put(
        `${ENV.Backend_API}/expense/update/${editId}`,
        data,
        {
          headers: {
            ...getAuthHeader(),
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("Expense updated successfully");
      resetForm();
      getExpenses();
      getAllExpensesForTotals();
    } catch (error) {
      toast.error("Failed to update expense");
    }
  };

  const deleteExpense = async (id) => {
    if (!window.confirm("Delete this expense?")) return;
    try {
      await axios.delete(`${ENV.Backend_API}/expense/delete/${id}`, {
        headers: getAuthHeader(),
      });
      toast.success("Expense deleted");
      getExpenses();
      getAllExpensesForTotals();
    } catch (error) {
      toast.error("Failed to delete expense");
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title || "",
      amount: item.amount || "",
      category: item.category || "",
      type: item.type || "",
      description: item.description || "",
      date: item.date ? new Date(item.date).toISOString().split("T")[0] : "",
      image: null, // keep existing image unless user uploads a new one
    });
    setEditId(item._id);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      amount: "",
      category: "",
      type: "",
      description: "",
      date: "",
      image: null,
    });
    setEditId(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    editId ? updateExpense() : addExpense();
  };

  const set = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  const totalIncome = allExpenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = allExpenses
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const balance = totalIncome - totalExpense;

  // ======pageination controller===========

  const itemsPerPage = 5;
  const [itemOffset, setItemOffset] = useState(0);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = expenses.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(expenses.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % expenses.length;
    setItemOffset(newOffset);
  };

  return (
    <div className="expense-page">
      <h1 className="expense-page-title">Expense Tracker</h1>
      <div className="dashboard-cards">
        <div className="dashboard-card">
          <h4>Total Income</h4>
          <h2>₹{totalIncome.toLocaleString("en-IN")}</h2>
        </div>

        <div className="dashboard-card">
          <h4>Total Expense</h4>
          <h2>₹{totalExpense.toLocaleString("en-IN")}</h2>
        </div>

        <div className="dashboard-card">
          <h4>Balance</h4>
          <h2>₹{balance.toLocaleString("en-IN")}</h2>
        </div>
      </div>

      <div className="expense-layout">
        {/* LEFT: Table */}
        <div className="expense-table-section">
          <div className="table-header">
            <span className="expense-table-tab">Expenses Overview</span>

            <div className="filter-section">
              <input
                type="text"
                placeholder="Search by title..."
                value={search}
                onChange={(e) => setsearch(e.target.value)}
              />

              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="">All Categories</option>

                {categories.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={filterDate}
                onChange={(e) => setFilterDate(e.target.value)}
              />

              <input
                type="number"
                placeholder="Filter Amount"
                value={filterAmount}
                onChange={(e) => setFilterAmount(e.target.value)}
              />

              <button
                onClick={() => {
                  setFilterCategory("");
                  setFilterDate("");
                  setFilterAmount("");
                }}
              >
                Clear Filter
              </button>
            </div>
          </div>
          <div className="expense-table-scroll">
            <table className="expense-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Amount</th>
                  <th>Category</th>
                  <th>Type</th>
                  <th>Description</th>
                  <th>Date</th>
                  <th>Image</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={9} className="expense-table-empty">
                      Loading...
                    </td>
                  </tr>
                ) : expenses.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="expense-table-empty">
                      No expenses found
                    </td>
                  </tr>
                ) : (
                  filteredExpenses.map((item, idx) => (
                    <tr
                      key={item._id}
                      className={editId === item._id ? "editing" : ""}
                    >
                      <td className="muted">{idx + 1}</td>
                      <td>{item.title}</td>
                      <td className="amount">
                        ₹{Number(item.amount).toLocaleString("en-IN")}
                      </td>
                      <td className="muted">{item.category}</td>
                      <td>
                        <span
                          className={`expense-badge ${
                            item.type === "income"
                              ? "expense-badge-income"
                              : "expense-badge-expense"
                          }`}
                        >
                          {item.type}
                        </span>
                      </td>
                      <td className="description-cell muted">
                        {item.description || "—"}
                      </td>
                      <td className="muted">
                        {item.date
                          ? new Date(item.date).toLocaleDateString("en-IN")
                          : "—"}
                      </td>
                      <td className="image-cell">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt="expense"
                            className="expense-thumbnail"
                          />
                        ) : (
                          <span className="muted">—</span>
                        )}
                      </td>
                      <td className="actions-cell">
                        <button
                          className="btn-update"
                          onClick={() => handleEdit(item)}
                        >
                          Update
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteExpense(item._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <div className="pagination">
            <button
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              ❮
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;

              if (
                page === 1 ||
                page === totalPages ||
                (page >= currentPage - 1 && page <= currentPage + 1)
              ) {
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "active-page" : ""}
                  >
                    {page}
                  </button>
                );
              }

              if (page === currentPage - 2 || page === currentPage + 2) {
                return <span key={page}>...</span>;
              }

              return null;
            })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              ❯
            </button>
          </div>
        </div>
        {/* RIGHT: Form */}
        <div className="expense-form-card">
          <span className="expense-form-tab">
            {editId ? "Edit Expense" : "New Entry Form"}
          </span>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                className="form-input"
                type="text"
                placeholder="E.g., Office lunch"
                value={formData.title}
                onChange={set("title")}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Amount</label>
              <input
                className="form-input"
                type="number"
                placeholder="₹ 0"
                value={formData.amount}
                onChange={set("amount")}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={set("category")}
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                className="form-select"
                value={formData.type}
                onChange={set("type")}
                required
              >
                <option value="">Select type</option>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                className="form-textarea"
                placeholder="Optional notes..."
                value={formData.description}
                onChange={set("description")}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                value={formData.date}
                onChange={set("date")}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Image Upload</label>
              <input
                className="form-input"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    image: e.target.files?.[0] || null,
                  }))
                }
              />
            </div>

            <button type="submit" className="btn-submit">
              {editId ? "Update Expense" : "Add Expense"}
            </button>

            {editId && (
              <button type="button" className="btn-cancel" onClick={resetForm}>
                Cancel edit
              </button>
            )}
          </form>
        </div>
      </div>
        <div className="dashboard-cards">
            ...
            <button onClick={() => navigate("/chart")} className="chart-btn">
              View Analytics 📊
            </button>
          </div>
    </div>
    
  );
}

export default Expense;
