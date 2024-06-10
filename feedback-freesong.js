
  document.addEventListener('DOMContentLoaded', () => {
    initializeForm();
  });

  const dogData = {
    names: [],
    ages: {},
    genders: {},
    breeds: {}
  };

  function initializeForm() {
    // Initialize placeholders
    document.querySelectorAll('.form-input').forEach(input => {
      togglePlaceholder(input);
      input.addEventListener('input', () => togglePlaceholder(input));
    });

    // Initialize button events
    document.querySelectorAll('.next-btn').forEach((button, index) => {
      button.addEventListener('click', () => validateAndShowNextQuestion(index + 1));
    });

    document.querySelectorAll('.back-btn').forEach((button, index) => {
      button.addEventListener('click', () => showPreviousQuestion(index + 1));
    });

    updateRemoveButtons();
  }

  function togglePlaceholder(input) {
    if (input.value !== '') {
      input.classList.add('not-empty');
    } else {
      input.classList.remove('not-empty');
    }
  }

  function validateAndShowNextQuestion(currentQuestion) {
    const validationBox = document.getElementById('validationBox');
    validationBox.innerHTML = '';
    validationBox.style.display = 'none';

    let isValid = false;

    if (currentQuestion === 1) {
      isValid = validateDogNames(validationBox);
    } else if (currentQuestion === 2) {
      isValid = validateDogAges(validationBox);
    } else if (currentQuestion === 3) {
      isValid = validateDogGenders(validationBox);
    }

    if (isValid) {
      showNextQuestion(currentQuestion + 1);
    }
  }

  function showNextQuestion(nextQuestion) {
    const currentQuestion = document.getElementById('question' + (nextQuestion - 1));
    const nextQuestionElement = document.getElementById('question' + nextQuestion);
    currentQuestion.style.display = 'none';
    nextQuestionElement.style.display = 'block';

    if (nextQuestion === 2) {
      populateAges();
    } else if (nextQuestion === 3) {
      populateGenders();
    } else if (nextQuestion === 4) {
      populateBreeds();
    }
  }

  function showPreviousQuestion(previousQuestion) {
    const currentQuestion = document.getElementById('question' + (previousQuestion + 1));
    const previousQuestionElement = document.getElementById('question' + previousQuestion);
    currentQuestion.style.display = 'none';
    previousQuestionElement.style.display = 'block';
  }

  function populateAges() {
    dogData.names = Array.from(document.querySelectorAll('#dogNames .form-input'))
      .map(input => input.value.trim())
      .filter(name => name);

    const ageContainer = document.getElementById('dogAges');
    ageContainer.innerHTML = '';

    dogData.names.forEach((name, index) => {
      const inputWrapper = createInputWrapper(`Enter ${name}'s age`, `dogageinput${index + 1}`);
      const input = inputWrapper.querySelector('input');
      input.value = dogData.ages[input.id] || '';
      input.addEventListener('input', () => {
        dogData.ages[input.id] = input.value;
      });
      ageContainer.appendChild(inputWrapper);
    });
  }

  function populateGenders() {
    const genderContainer = document.getElementById('dogGenders');
    genderContainer.innerHTML = '';

    dogData.names.forEach((name, index) => {
      const inputWrapper = document.createElement('div');
      inputWrapper.className = 'input-wrapper';
      inputWrapper.innerHTML = `
        <label class="question-label">Is ${name} a male or female?</label>
        <div class="radio-group">
          <label class="radio-container">
            <input type="radio" name="gender${index}" id="male${index}" value="male" class="radio-input">
            <span class="radio-label">Male</span>
          </label>
          <label class="radio-container">
            <input type="radio" name="gender${index}" id="female${index}" value="female" class="radio-input">
            <span class="radio-label">Female</span>
          </label>
        </div>`;
      const maleInput = inputWrapper.querySelector(`#male${index}`);
      const femaleInput = inputWrapper.querySelector(`#female${index}`);
      if (dogData.genders[`gender${index}`] === 'male') {
        maleInput.checked = true;
      } else if (dogData.genders[`gender${index}`] === 'female') {
        femaleInput.checked = true;
      }
      maleInput.addEventListener('input', () => {
        dogData.genders[`gender${index}`] = 'male';
      });
      femaleInput.addEventListener('input', () => {
        dogData.genders[`gender${index}`] = 'female';
      });
      genderContainer.appendChild(inputWrapper);
    });
  }

  function populateBreeds() {
    const breedContainer = document.getElementById('dogBreeds');
    breedContainer.innerHTML = '';

    dogData.names.forEach((name, index) => {
      const inputWrapper = createInputWrapper(`Enter breed for ${name}`, `dogbreedinput${index + 1}`);
      const input = inputWrapper.querySelector('input');
      input.value = dogData.breeds[input.id] || '';
      input.addEventListener('input', () => {
        dogData.breeds[input.id] = input.value;
        showBreedSuggestions(input);
      });
      breedContainer.appendChild(inputWrapper);
    });
  }

  function createInputWrapper(placeholder, inputId) {
    const inputWrapper = document.createElement('div');
    inputWrapper.className = 'input-wrapper';
    inputWrapper.innerHTML = `
      <input type="text" id="${inputId}" placeholder=" " class="form-input">
      <label for="${inputId}" class="form-label">${placeholder}</label>
      <span id="${inputId}-validation" class="validation-message"></span>`;
    return inputWrapper;
  }

  function showBreedSuggestions(input) {
    const dogBreeds = [
      "Labrador Retriever", "German Shepherd", "Golden Retriever", "French Bulldog", "Bulldog",
      "Poodle", "Beagle", "Rottweiler", "German Shorthaired Pointer", "Yorkshire Terrier",
      "Boxer", "Siberian Husky", "Dachshund", "Great Dane", "Pembroke Welsh Corgi",
      "Doberman Pinscher", "Australian Shepherd", "Cavalier King Charles Spaniel", "Shih Tzu",
      "Boston Terrier", "Pomeranian", "Havanese", "Shetland Sheepdog", "Bernese Mountain Dog",
      "Brittany", "English Springer Spaniel", "Miniature Schnauzer", "Cocker Spaniel", "Border Collie",
      "Basset Hound", "Maltese", "Chihuahua", "Vizsla", "Pug", "Weimaraner", "Newfoundland",
      "Collie", "West Highland White Terrier", "Bichon Frise", "Rhodesian Ridgeback"
    ];

    const suggestions = document.createElement('div');
    suggestions.className = 'suggestions';
    const inputWrapper = input.parentNode;
    const currentSuggestions = inputWrapper.querySelector('.suggestions');
    if (currentSuggestions) {
      inputWrapper.removeChild(currentSuggestions);
    }

    const matchedBreeds = dogBreeds.filter(breed => breed.toLowerCase().includes(input.value.toLowerCase())).slice(0, 4);
    matchedBreeds.forEach(breed => {
      const suggestion = document.createElement('div');
      suggestion.className = 'suggestion';
      suggestion.textContent = breed;
      suggestion.addEventListener('click', function() {
        input.value = breed;
        dogData.breeds[input.id] = breed;
        inputWrapper.removeChild(suggestions);
      });
      suggestions.appendChild(suggestion);
    });

    if (matchedBreeds.length > 0) {
      inputWrapper.appendChild(suggestions);
    }
  }

  function validateDogNames(validationBox) {
    let isValid = true;
    const dogInputs = document.querySelectorAll('#dogNames .form-input');
    dogInputs.forEach((input, index) => {
      if (input.value.trim() === "") {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Please enter a name for dog ${index + 1}.`;
        validationBox.appendChild(errorMessage);
        validationBox.style.display = 'block';
        input.classList.add('input-error');
        isValid = false;
      } else {
        input.classList.remove('input-error');
      }
    });
    return isValid;
  }

  function validateDogAges(validationBox) {
    let isValid = true;
    const ageInputs = document.querySelectorAll('#dogAges .form-input');
    ageInputs.forEach((input, index) => {
      if (input.value.trim() === "") {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Please enter an age for ${dogData.names[index]}.`;
        validationBox.appendChild(errorMessage);
        validationBox.style.display = 'block';
        input.classList.add('input-error');
        isValid = false;
      } else if (isNaN(input.value.trim())) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Please enter a valid number for ${dogData.names[index]}.`;
        validationBox.appendChild(errorMessage);
        validationBox.style.display = 'block';
        input.classList.add('input-error');
        isValid = false;
      } else {
        input.classList.remove('input-error');
      }
    });
    return isValid;
  }

  function validateDogGenders(validationBox) {
    let isValid = true;
    dogData.names.forEach((name, index) => {
      const genderValue = document.querySelector(`input[name="gender${index}"]:checked`);
      if (!genderValue) {
        const errorMessage = document.createElement('div');
        errorMessage.textContent = `Please select a gender for ${name}.`;
        validationBox.appendChild(errorMessage);
        validationBox.style.display = 'block';
        isValid = false;
      } else {
        dogData.genders[`gender${index}`] = genderValue.value;
      }
    });
    return isValid;
  }

  function updateRemoveButtons() {
    const wrappers = document.querySelectorAll('.input-wrapper');
    wrappers.forEach((wrapper, index) => {
      const removeBtn = wrapper.querySelector('.remove-btn');
      if (removeBtn) {
        removeBtn.style.display = index > 0 ? 'block' : 'none';
      }
    });
  }

  function addDogName() {
    const validationBox = document.getElementById('validationBox');
    if (dogCount >= 5) {
      validationBox.innerHTML = 'We\'re sorry, but you can only add up to 5 dog names.';
      validationBox.style.display = 'block';
      return;
    }
    dogCount++;
    validationBox.style.display = 'none';

    const container = document.getElementById("dogNames");
    const inputWrapper = createInputWrapper("Enter your pupper's name", `dognameinput${dogCount}`);
    container.appendChild(inputWrapper);
    updateRemoveButtons();
  }

  function removeDogName(wrapper) {
    wrapper.remove();
    dogCount--;
    updateRemoveButtons();
  }

  let dogCount = 1;
