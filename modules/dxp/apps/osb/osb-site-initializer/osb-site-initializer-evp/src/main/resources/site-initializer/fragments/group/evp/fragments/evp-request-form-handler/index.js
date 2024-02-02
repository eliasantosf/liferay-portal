/* eslint-disable @liferay/portal/no-global-fetch */
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

const requestType = document.querySelector('[name="requestType"]');
const requestStatus = document.querySelector('[name="requestStatus"]');
const serviceForm = document.getElementsByClassName('.service-form');
const grantForm = document.getElementsByClassName('.grant-form');

function updateValue(requestType) {
	const grantFormHidden = grantForm[0].classList.contains('d-none');
	const serviceFormHidden = serviceForm[0].classList.contains('d-none');

	if (requestType.value === 'grant' && grantFormHidden) {
		toggleForm(grantForm[0], toggleGrantRequired);
		resetAndToggleForm(serviceForm[0], toggleServiceRequired);
	}

	if (requestType.value === 'service' && serviceFormHidden) {
		toggleForm(serviceForm[0], toggleServiceRequired);
		resetAndToggleForm(grantForm[0], toggleGrantRequired);
	}

	requestStatus.value = 'awaitingApprovalOnEVP';
}

function toggleForm(form, toggleFunction) {
	form.classList.toggle('d-none');
	toggleFunction(form);
}

function resetAndToggleForm(form, toggleFunction) {
	if (!form.classList.contains('d-none')) {
		resetFormValues(form);
		toggleForm(form, toggleFunction);
	}
}

function resetFormValues(form) {
	form.querySelectorAll('input, select').forEach((field) => {
		field.value = field.type === 'number' ? 0 : '';
	});
}

function toggleServiceRequired(service) {
	const fields = [
		'managerEmailAddress',
		'totalHoursRequested',
		'startDate',
		'endDate',
	];

	fields.forEach((field) => {
		service.querySelector(
			`[name="${field}"]`
		).required = !service.querySelector(`[name="${field}"]`).required;
	});
}

function toggleGrantRequired(grant) {
	const grantAmountField = grant.querySelector('[name="grantAmount"]');
	grantAmountField.required = !grantAmountField.required;
}

const getUser = async () => {
	const response = await fetch(
		`/o/headless-admin-user/v1.0/my-user-account`,
		{
			headers: {
				'content-type': 'application/json',
				'x-csrf-token': Liferay.authToken,
			},
			method: 'GET',
		}
	);

	const data = await response.json();

	return data;
};

function handleDocumentClick() {
	updateValue(requestType);
}

function getManagerData(user) {
	const managerField = user?.customFields.find(
		(field) => field.name === 'Manager'
	);

	return managerField?.customValue?.data || null;
}

function fillManagerEmailAddress(managerData, managerEmailAddressInput) {
	managerEmailAddressInput.value = managerData;
	managerEmailAddressInput.readOnly = true;
}

function fillFullNameAndEmailAddress(user) {
	const fullNameInput = document.querySelector('[name="fullName"]');
	const emailAddressInput = document.querySelector('[name="emailAddress"]');

	emailAddressInput.value = user?.emailAddress;
	emailAddressInput.readOnly = true;

	fullNameInput.value = user?.name;
	fullNameInput.readOnly = true;
}

const getData = (user, fieldName) => {
	const field = user?.customFields.find((field) => field.name === fieldName);

	return field?.customValue?.data || null;
};

const validateGrantAmount = (
	user,
	errorMessageGrant,
	grantAmountInput,
	submitBtn
) => {
	grantAmountInput.addEventListener('input', () => {
		const inputValue = grantAmountInput.value;
		const grantValue = getData(user, 'EVP Grant Value');

		const isInsufficientFunds = inputValue > grantValue;

		errorMessageGrant.innerHTML = isInsufficientFunds
			? Liferay.Util.escape('Insufficient funds')
			: '';
		grantAmountInput.style.backgroundColor = isInsufficientFunds
			? '#fce3ea'
			: '';
		grantAmountInput.style.borderColor = isInsufficientFunds ? 'red' : '';
		submitBtn.disabled = isInsufficientFunds;
	});
};

const validateTotalHoursRequested = (
	user,
	errorMessageService,
	submitBtn,
	totalHoursInput
) => {
	totalHoursInput.addEventListener('input', () => {
		const inputValue = totalHoursInput.value;
		const valueOfHoursOfService = getData(
			user,
			'EVP Value of Hours of Service'
		);

		const isInsufficientFunds = inputValue > valueOfHoursOfService;

		errorMessageService.innerHTML = isInsufficientFunds
			? Liferay.Util.escape('Insufficient hours')
			: '';
		totalHoursInput.style.backgroundColor = isInsufficientFunds
			? '#fce3ea'
			: '';
		totalHoursInput.style.borderColor = isInsufficientFunds ? 'red' : '';
		submitBtn.disabled = isInsufficientFunds;
	});
};

async function init() {
	const user = await getUser();
	const errorMessageGrant = document.querySelector('.error-message-grant');
	const errorMessageService = document.querySelector(
		'.error-message-service'
	);
	const grantAmountInput = document.querySelector('[name="grantAmount"]');
	const managerData = getManagerData(user);
	const managerEmailAddressInput = document.querySelector(
		'[name="managerEmailAddress"]'
	);
	const submitBtn = document.querySelector('[name="status"]');

	const totalHoursInput = document.querySelector(
		'[name="totalHoursRequested"]'
	);

	if (!managerData) {
		managerEmailAddressInput.placeholder = 'No Manager';
		managerEmailAddressInput.readOnly = true;
	} else {
		fillManagerEmailAddress(managerData, managerEmailAddressInput);
	}

	if (user?.name && user?.emailAddress) {
		fillFullNameAndEmailAddress(user);
	}

	validateGrantAmount(user, errorMessageGrant, grantAmountInput, submitBtn);
	validateTotalHoursRequested(
		user,
		errorMessageService,
		submitBtn,
		totalHoursInput
	);

	document.addEventListener('click', handleDocumentClick);
}

init();
