let coverLetter = `...`;

const linkWithFilters = `...`;

let delayTimeMS = 800;

function triggerInputChange(node, value = '') {
  const inputTypes = [
    window.HTMLInputElement,
    window.HTMLSelectElement,
    window.HTMLTextAreaElement,
  ];

  if (inputTypes.includes(node?.__proto__?.constructor)) {
    const valueSetter = Object.getOwnPropertyDescriptor(node.__proto__, 'value').set;
	  valueSetter.call(node, value.replace(/\n/g, '\r\n'));

    const event = new Event('input', { bubbles: true });

    node.dispatchEvent(event);
  }
}

async function handleAdditionalCoverLetterClick() {
  // Задержка перед нажатием, чтобы попап успел открыться
  await delay(delayTimeMS);
  await delay(delayTimeMS);

  const addCoverLetterBtn = document.querySelector('[data-qa="add-cover-letter"]');
  
  if (addCoverLetterBtn) {
      addCoverLetterBtn.click();
  }
}

async function handlerCoverLetter() {
    await delay(delayTimeMS);

    let messageArea;
    let btnSubmit;

    if (document.querySelector('[data-qa="vacancy-response-letter-toggle"]')) {
        document.querySelector('[data-qa="vacancy-response-letter-toggle"]').click();
        await delay(150);

        messageArea = document.querySelector(".magritte-textarea-native___w-czf_2-0-57");
        triggerInputChange(messageArea, coverLetter);
        btnSubmit = document.querySelector('[data-qa="vacancy-response-letter-submit"]');
    }
    else if (document.querySelector('[data-qa="vacancy-response-popup-form-letter-input"]')) {
        messageArea = document.querySelector('[data-qa="vacancy-response-popup-form-letter-input"]');
        triggerInputChange(messageArea, coverLetter);
        btnSubmit = document.querySelector('[data-qa="vacancy-response-submit-popup"]');
    } else {
        messageArea = document.querySelector(".magritte-textarea-native___w-czf_2-0-57");
        triggerInputChange(messageArea, coverLetter);
        btnSubmit = document.querySelector('[data-qa="vacancy-response-submit-popup"]');
    }

    await delay(150);
    btnSubmit.click();

    await delay(delayTimeMS);
    window.location.href = linkWithFilters + '&continue=true';
}

// Остальной ваш код без изменений
async function autoResponse() {
    let vacancies = document.querySelectorAll('[data-qa="vacancy-serp__vacancy_response"]');

    if (vacancies.length) {
        if (window.location.search.includes('delete=true')) {
            console.log('deleted');
            const btn = document.querySelector('[data-qa="vacancy__blacklist-show-add"]');

            btn.click();
            await delay(1200);

            const block = document.querySelector('[data-qa="vacancy__blacklist-menu-add-vacancy"]');
            block.click();
            window.location.href = linkWithFilters + '&continue=true';
            await delay(delayTimeMS);
        }

        vacancies[0].click();

        vacancies[0].parentElement.parentElement.parentElement.parentElement.scrollIntoView();

        await delay(delayTimeMS + 1000);
        const reloc = document.querySelector('[data-qa="relocation-warning-confirm"]');
        if (reloc) {
            reloc.click();
            await delay(delayTimeMS);
        }

        if (document.querySelector('[data-qa="employer-asking-for-test"]')) {
            console.log('employer test found, return and blacklist');
            window.location.href = linkWithFilters + '&continue=true&delete=true';
        } else {
            console.log('vacancie is ok, proceed to cover letter');
    		    await handleAdditionalCoverLetterClick();
            await handlerCoverLetter();
        }
    } else {
        let vacancy = document.querySelector('[data-qa="vacancy-response-link-top"]');
        await delay(delayTimeMS);

        if (vacancy) {
            vacancy.click();

            await delay(delayTimeMS);

            if (document.querySelector('[data-qa="employer-asking-for-test"]')) {
                window.location.href = linkWithFilters + '&continue=true&delete=true';
            } else {
    			      // Проверка и нажатие "add-cover-letter" после открытия попап
    			      await handleAdditionalCoverLetterClick();
                await handlerCoverLetter();
            }
        } else if (window.location.pathname === '/applicant/vacancy_response') {
            // Проверка и нажатие "add-cover-letter" после открытия попап
            await handleAdditionalCoverLetterClick();            
            await handlerCoverLetter();
        }
    }
}

function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

if (window.location.pathname === '/applicant/vacancy_response' || window.location.pathname.includes('/vacancy/') || window.location.search.includes('continue=true')) {
    autoResponse();

    // if script didn't start for some reason
    setInterval(() => autoResponse(), 10000);
}
