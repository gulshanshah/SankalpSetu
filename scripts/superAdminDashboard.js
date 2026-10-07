const openAddHospitalPopup = document.getElementById("addHospitalButton");
const closeAddHospitalPopup = document.getElementById("closeAddHospital");
const addHospitalPopup = document.getElementById("addHospital");
const openAddDoctorPopup = document.getElementById("addDoctorButton");
const closeAddDoctorPopup = document.getElementById("closeAddDoctor");
const addDoctorPopup = document.getElementById("addDoctor");

openAddHospitalPopup.addEventListener('click', () => {
    addHospitalPopup.style.display = 'block';
});

closeAddHospitalPopup.addEventListener('click', () => {
    addHospitalPopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === addHospitalPopup) {
        addHospitalPopup.style.display = 'none';
    }
});

openAddDoctorPopup.addEventListener('click', () => {
    addDoctorPopup.style.display = 'block';
});

closeAddDoctorPopup.addEventListener('click', () => {
    addDoctorPopup.style.display = 'none';
});

window.addEventListener('click', (event) => {
    if (event.target === addDoctorPopup) {
        addDoctorPopup.style.display = 'none';
    }
});
