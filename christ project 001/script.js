// Sample login credentials
const users = [
    { username: "admin", password: "admin123", role: "Admin" },
    { username: "hr", password: "hr123", role: "HR" }
  ];
  
  let employees = [];
  let departments = [];
  
  document.getElementById("login-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;
    const role = document.getElementById("login-role").value;
  
    const user = users.find(u => u.username === username && u.password === password && u.role === role);
    if (user) {
      document.getElementById("login-page").style.display = "none";
      document.getElementById("app").style.display = "flex";
      document.getElementById("user-info").textContent = `${user.role} (${user.username})`;
      updateDashboard();
      updateDepartmentOptions();
    } else {
      document.getElementById("login-error").textContent = "Invalid login!";
    }
  });
  
  document.querySelectorAll("aside li[data-section]").forEach(item => {
    item.addEventListener("click", () => {
      document.querySelectorAll(".section").forEach(sec => sec.style.display = "none");
      document.querySelectorAll("aside li").forEach(li => li.classList.remove("active"));
      item.classList.add("active");
  
      const sectionId = item.getAttribute("data-section") + "-section";
      document.getElementById(sectionId).style.display = "block";
      document.getElementById("page-title").textContent = item.textContent;
    });
  });
  
  document.getElementById("logout").addEventListener("click", () => location.reload());
  
  document.getElementById("department-form").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("dept-name").value.trim();
    if (name && !departments.includes(name)) {
      departments.push(name);
      updateDepartmentOptions();
      renderDepartments();
      document.getElementById("dept-name").value = "";
    }
  });
  
  function updateDepartmentOptions() {
    const select = document.getElementById("emp-department");
    select.innerHTML = '<option value="">Select Department</option>';
    departments.forEach(d => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = d;
      select.appendChild(opt);
    });
  }
  
  function renderDepartments() {
    const ul = document.getElementById("department-list");
    ul.innerHTML = "";
    departments.forEach(d => {
      const li = document.createElement("li");
      li.textContent = d;
      ul.appendChild(li);
    });
    document.getElementById("department-count").textContent = `Departments: ${departments.length}`;
  }
  
  document.getElementById("employee-form").addEventListener("submit", e => {
    e.preventDefault();
    const id = document.getElementById("emp-id").value;
    const emp = {
      id: id || Date.now(),
      first: document.getElementById("emp-first").value,
      last: document.getElementById("emp-last").value,
      position: document.getElementById("emp-position").value,
      salary: parseFloat(document.getElementById("emp-salary").value),
      department: document.getElementById("emp-department").value,
      photo: document.getElementById("emp-photo").files[0] ? URL.createObjectURL(document.getElementById("emp-photo").files[0]) : null
    };
  
    if (id) {
      const index = employees.findIndex(e => e.id == id);
      employees[index] = emp;
    } else {
      employees.push(emp);
    }
  
    e.target.reset();
    renderEmployees();
    updateDashboard();
  });
  
  function renderEmployees() {
    const tbody = document.querySelector("#employee-table tbody");
    tbody.innerHTML = "";
    employees.forEach(emp => {
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td><img src="${emp.photo || "https://via.placeholder.com/40"}" /></td>
        <td>${emp.first} ${emp.last}</td>
        <td>${emp.position}</td>
        <td>${emp.department}</td>
        <td>$${emp.salary.toFixed(2)}</td>
        <td>
          <button onclick="editEmployee(${emp.id})">Edit</button>
          <button onclick="deleteEmployee(${emp.id})">Delete</button>
        </td>
      `;
      tbody.appendChild(tr);
    });
  
    renderPayroll();
    document.getElementById("employee-count").textContent = `Employees: ${employees.length}`;
  }
  
  function editEmployee(id) {
    const emp = employees.find(e => e.id === id);
    document.getElementById("emp-id").value = emp.id;
    document.getElementById("emp-first").value = emp.first;
    document.getElementById("emp-last").value = emp.last;
    document.getElementById("emp-position").value = emp.position;
    document.getElementById("emp-salary").value = emp.salary;
    document.getElementById("emp-department").value = emp.department;
  }
  
  function deleteEmployee(id) {
    employees = employees.filter(e => e.id !== id);
    renderEmployees();
    updateDashboard();
  }
  
  function renderPayroll() {
    const tbody = document.querySelector("#payroll-table tbody");
    tbody.innerHTML = "";
    employees.forEach(emp => {
      const tax = emp.salary * 0.1;
      const pension = emp.salary * 0.05;
      const net = emp.salary - tax - pension;
  
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${emp.first} ${emp.last}</td>
        <td>$${emp.salary.toFixed(2)}</td>
        <td>Tax: $${tax.toFixed(2)} | Pension: $${pension.toFixed(2)}</td>
        <td>$${net.toFixed(2)}</td>
      `;
      tbody.appendChild(tr);
    });
    document.getElementById("payroll-count").textContent = `Payroll Records: ${employees.length}`;
  }
  
  function updateDashboard() {
    document.getElementById("employee-count").textContent = `Employees: ${employees.length}`;
    document.getElementById("payroll-count").textContent = `Payroll Records: ${employees.length}`;
    document.getElementById("department-count").textContent = `Departments: ${departments.length}`;
  }
  