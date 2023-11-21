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
	managerEmailAddressInput.disabled = true;
}

async function init() {
	const user = await getUser();
	const managerData = getManagerData(user);
	const managerEmailAddress = document.querySelector('.managerEmailAddress');
	const managerEmailAddressInput = document.querySelector(
		'[name="managerEmailAddress"]'
	);

	if (!managerData) {
		managerEmailAddress.style.display = 'none';
	} else {
		fillManagerEmailAddress(managerData, managerEmailAddressInput);
	}

	document.addEventListener('click', handleDocumentClick);
}

init();
