document.addEventListener('DOMContentLoaded', function () {
    fetch('students.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(student => addStudentToTable(student));
        })
        .catch(error => console.error('Error loading students:', error));
});

function validateForm() {
    let isValid = true;

    // Validate Name
    const name = document.getElementById('name').value.trim();
    if (name === '' || name.length > 50) {
        document.getElementById('nameError').textContent = 'Name is required and must be less than 50 characters.';
        document.getElementById('nameError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('nameError').style.display = 'none';
    }

    // Validate Birthday
    const birthday = document.getElementById('birthday').value;
    const age = calculateAge(birthday);
    if (birthday === '' || age < 0 || age > 100) {
        document.getElementById('birthdayError').textContent = 'Valid birthday is required.';
        document.getElementById('birthdayError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('birthdayError').style.display = 'none';
    }

    // Validate Mobile
    const mobile = document.getElementById('mobile').value.trim();
    if (mobile === '' || !/^\d{10}$/.test(mobile)) {
        document.getElementById('mobileError').textContent = 'Mobile phone must be a 10-digit number.';
        document.getElementById('mobileError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('mobileError').style.display = 'none';
    }

    // Validate Hometown
    const hometown = document.getElementById('hometown').value.trim();
    if (hometown === '') {
        document.getElementById('hometownError').textContent = 'Hometown is required.';
        document.getElementById('hometownError').style.display = 'block';
        isValid = false;
    } else {
        document.getElementById('hometownError').style.display = 'none';
    }

    return isValid;
}

function calculateAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

function addStudentToTable(student) {
    const studentTableBody = document.querySelector('#studentTable tbody');
    const row = document.createElement('tr');
    row.innerHTML = `
        <td><input type="checkbox" class="student-checkbox" onclick="updateButtonsState()"></td>
        <td>${student.name}</td>
        <td>${student.birthday}</td>
        <td>${student.mobile}</td>
        <td>${student.hometown}</td>
    `;
    studentTableBody.appendChild(row);
}

function saveStudent() {
    if (!validateForm()) return;

    const name = document.getElementById('name').value.trim();
    const birthday = document.getElementById('birthday').value;
    const mobile = document.getElementById('mobile').value.trim();
    const hometown = document.getElementById('hometown').value.trim();

    const newStudent = {
        name: name,
        birthday: birthday,
        mobile: mobile,
        hometown: hometown
    };

    // Here you would typically send the new student data to the server
    console.log('Saving student:', newStudent);

    addStudentToTable(newStudent);

    // Optionally reset the form
    document.getElementById('studentForm').reset();
}

function updateButtonsState() {
    const checkboxes = document.querySelectorAll('.student-checkbox');
    const checkedCheckboxes = Array.from(checkboxes).filter(cb => cb.checked);
    const deleteBtn = document.getElementById('deleteBtn');
    const editBtn = document.getElementById('editBtn');

    deleteBtn.disabled = checkedCheckboxes.length === 0;
    editBtn.disabled = checkedCheckboxes.length !== 1;
}

function deleteStudent() {
    if (!confirm('Bạn có chắc chắn muốn xóa sinh viên đang chọn?')) return;

    const checkboxes = document.querySelectorAll('.student-checkbox:checked');
    checkboxes.forEach(cb => cb.closest('tr').remove());

    updateButtonsState();
}

function editStudent() {
    const checkedCheckboxes = document.querySelectorAll('.student-checkbox:checked');
    if (checkedCheckboxes.length !== 1) {
        alert('Bạn chỉ được sửa thông tin của 1 sinh viên');
        return;
    }

    const row = checkedCheckboxes[0].closest('tr');
    const cells = row.querySelectorAll('td');

    document.getElementById('name').value = cells[1].textContent;
    document.getElementById('birthday').value = cells[2].textContent;
    document.getElementById('mobile').value = cells[3].textContent;
    document.getElementById('hometown').value = cells[4].textContent;

    row.remove();
    updateButtonsState();
}
