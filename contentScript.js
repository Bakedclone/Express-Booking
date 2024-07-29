(() => {
    function extractTrainNumber(train_details) {
        var numberRegex = /\d+/g;
        var numbersArray = train_details.match(numberRegex);
        return numbersArray ? numbersArray[0] : null;
    }

    let trainNumber;
    let passengerData;

    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'autofillForm') {
            console.log("Clicked");
            trainNumber = request.trainNumber;
            passengerData = request.passengerData;
            console.log("train number : " + trainNumber);
            // let btn = document.getElementsByClassName('search_btn train_Search');
            // if (btn.length > 0) {
            //     var currentTime = new Date();
            //     var currentMinute = currentTime.getMinutes();
            //     var currentSecond = currentTime.getSeconds();
            //     var timeDifference = (1 - currentMinute) * 60 * 1000 + (60 - currentSecond) * 1000;
            //     setTimeout(() => {
            //         btn[0].click();
            //         sendResponse({ status: "search button clicked" });
            //     }, timeDifference);
            // } else {
            //     console.error("Search button not found");
            //     sendResponse({ status: "search button not found" });
            // }
            return true; // Keep the message channel open for async response
        }

        if (request.action === 'train-list') {
            let trainList = document.getElementsByClassName("form-group no-pad col-xs-12 bull-back border-all");
            if (trainList.length > 0) {
                for (let i = 0; i < trainList.length; i++) {
                    let strongTag = trainList[i].getElementsByTagName('strong');
                    let extractedNumber = extractTrainNumber(strongTag[0].textContent.trim());

                    if (extractedNumber == trainNumber) {
                        let coach = trainList[i].getElementsByClassName("pre-avl");
                        if (coach.length > 0) {
                            coach[0].click();
                            async function delayedGreeting(trainListItem) {
                                await sleep(1000);
                                let days = document.getElementsByClassName("link ng-star-inserted");
                                while (days.length == 0) {
                                    await sleep(1000);
                                    days = document.getElementsByClassName("link ng-star-inserted");
                                }
                                let nextDay = days[0].getElementsByClassName("pre-avl");
                                if (nextDay.length > 0) {
                                    nextDay[0].click();
                                    let nextPage = trainListItem.getElementsByClassName("btnDefault train_Search ng-star-inserted");
                                    if (nextPage.length > 0) {
                                        nextPage[0].click();
                                        sendResponse({ status: "train selected" });
                                    } else {
                                        console.error("Next page button not found");
                                        sendResponse({ status: "next page button not found" });
                                    }
                                } else {
                                    console.error("Next day availability not found");
                                    sendResponse({ status: "next day availability not found" });
                                }
                            }
                            delayedGreeting(trainList[i]);
                            return true; // Keep the message channel open for async response
                        } else {
                            console.error("Coach availability not found");
                            sendResponse({ status: "coach availability not found" });
                        }
                    }
                }
            } else {
                console.error("Train list not found");
                sendResponse({ status: "train list not found" });
            }
            return true; // Keep the message channel open for async response
        }

        if (request.action === "passenger-input") {
            console.log("Passenger Page:", passengerData);

            let buttonDiv = document.getElementsByClassName('zeroPadding pull-left ng-star-inserted');
            if (buttonDiv.length > 0) {
                buttonDiv[0].click();
                let addButton = buttonDiv[0].getElementsByTagName('a');
                for (let i = 1; i < passengerData.length; i++) {
                    addButton[0].click();
                }

                let inputAllNames = document.getElementsByClassName('ui-inputtext ui-widget ui-state-default ui-corner-all ui-autocomplete-input ng-star-inserted');
                for (let i = 0; i < inputAllNames.length; i++) {
                    inputAllNames[i].value = passengerData[i].name;
                    inputAllNames[i].dispatchEvent(new Event('input', { bubbles: true }));
                }

                
                let inputAgeAndGender = document.getElementsByClassName("form-control ng-untouched ng-pristine ng-invalid");
                for (let i = 0; i < passengerData.length; i++) {
                    let ageInput = inputAgeAndGender[0];
                    let genderInput = inputAgeAndGender[1];
                    if (ageInput && genderInput) {
                        ageInput.value = passengerData[i].age;
                        ageInput.dispatchEvent(new Event('input', { bubbles: true }));
                        
                        genderInput.value = passengerData[i].gender;
                        genderInput.dispatchEvent(new Event('input', { bubbles: true }));
                        genderInput.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                }

                let autoUpgradation = document.getElementById('autoUpgradation');
                let confirmBerth = document.getElementById('confirmberths');
                if (autoUpgradation) autoUpgradation.click();
                if (confirmBerth) confirmBerth.click();

                let BHIM_UPI = document.getElementsByClassName('form-group ng-untouched ng-pristine ng-valid');
                if (BHIM_UPI.length > 1) {
                    let BHIM_UPI_Radio = BHIM_UPI[1].getElementsByTagName('span');
                    if (BHIM_UPI_Radio.length > 0) {
                        BHIM_UPI_Radio[0].click();
                    }
                }

                let continueButton = document.getElementsByClassName('train_Search btnDefault');
                if (continueButton.length > 0) {
                    continueButton[0].click();
                    sendResponse({ status: "passenger input complete" });
                } else {
                    console.error("Continue button not found");
                    sendResponse({ status: "continue button not found" });
                }
            } else {
                console.error("Button div not found");
                sendResponse({ status: "button div not found" });
            }
            return true; // Keep the message channel open for async response
        }
    });

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
})();


