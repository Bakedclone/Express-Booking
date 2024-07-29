document.addEventListener('DOMContentLoaded', function () {
  const addPassengerButton = document.getElementById('addPassengerButton');
  const passengerList = document.getElementById('passengerList');
  const autofillButton = document.getElementById('autofillButton');
  let selectedPassengerData = [];

  // Function to load passengers from storage and display them
  function loadPassengers() {
    chrome.storage.sync.get(['passengers'], function (result) {
      passengerList.innerHTML = '';
      const passengers = result.passengers || [];
      passengers.forEach((passenger, index) => {
        const div = document.createElement('div');
        div.classList.add('list');
        const li = document.createElement('li');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `passengerCheckbox${index}`;
        checkbox.addEventListener('change', function () {
          if (checkbox.checked) {
            selectedPassengerData.push(passenger);
          } else {
            selectedPassengerData = selectedPassengerData.filter(p => p !== passenger);
          }
        });

        const label = document.createElement('label');
        label.htmlFor = `passengerCheckbox${index}`;
        label.textContent = `${passenger.name}, ${passenger.age}, ${passenger.gender}`;

        div.appendChild(checkbox);
        div.appendChild(label);
        // div.appendChild(li);
        passengerList.appendChild(div);
      });
    });
  }

  // Function to add a new passenger
  addPassengerButton.addEventListener('click', function () {
    const name = document.getElementById('passengerName').value;
    const age = document.getElementById('passengerAge').value;
    const gender = document.getElementById('passengerGender').value;

    if (name && age && gender) {
      const newPassenger = { name, age, gender };
      chrome.storage.sync.get(['passengers'], function (result) {
        const passengers = result.passengers || [];
        passengers.push(newPassenger);
        chrome.storage.sync.set({ passengers }, function () {
          loadPassengers();
        });
      });
    } else {
      alert('Please fill in all fields.');
    }
  });

  // Autofill button functionality (for demonstration)
  autofillButton.addEventListener('click', function () {
    console.log('Selected Passenger Data:', selectedPassengerData);
    const trainNumber = document.getElementById('trainNumber').value;

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { action: 'autofillForm', trainNumber: trainNumber, passengerData: selectedPassengerData });
    });
  });

  // Initial load of passengers
  loadPassengers();
});
