/* eslint-disable no-console */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * The contents of this file are subject to the terms of the Liferay Enterprise
 * Subscription License ("License"). You may not use this file except in
 * compliance with the License. You can obtain a copy of the License by
 * contacting Liferay, Inc. See the License for the specific language governing
 * permissions and limitations under the License, including but not limited to
 * distribution rights of the Software.
 */

import dayjs from 'dayjs';

import {PaymentConfirmationFilterType} from '../../types';
import fetcher from './fetcher';

const resource = 'o/c/evppaymentconfirmations/';

const nestedFields = '?nestedFields=r_financial_c_evpFinancial,r_requestId_c_evpRequest';


const finalFormatRequestTime = (dateFinal: string) => {
	return dateFinal.split('T')[0] + 'T23:59:59.999Z';
};

const createURLFilter = async (data: PaymentConfirmationFilterType) => {
	const filter = '/&filter=';
	const filterUrl = [];
	let ISOFormattedInitialPaymentDate;
	let ISOFormattedFinalPaymentDate;
	let formattedTimeFinalRequestDate;

	if (data.entityName) {
		filterUrl.push(
			`contains(financial/entityName,'${data.entityName.trim()}')`
		);
	}

	if (data.territoryId) {
		filterUrl.push(
			`contains(financial/territoryId,'${data.territoryId.trim()}')`
		);
	}

	if (data.accountNumberCR) {
		filterUrl.push(
			`contains(financial/accountNumberCR,'${data.accountNumberCR.trim()}')`
		);
	}

	if (data.accountNumberDB) {
		filterUrl.push(
			`contains(financial/accountNumberDB,'${data.accountNumberDB.trim()}')`
		);
	}

	if (data.accountTypeCR) {
		filterUrl.push(
			`contains(financial/accountTypeCR,'${data.accountTypeCR.trim()}')`
		);
	}

	if (data.accountTypeDB) {
		filterUrl.push(
			`contains(financial/accountTypeDB,'${data.accountTypeDB.trim()}')`
		);
	}

	if (data.initialPaymentDate && data.finalPaymentDate) {
		ISOFormattedInitialPaymentDate = dayjs(
			data.initialPaymentDate
		).toISOString();
		ISOFormattedFinalPaymentDate = dayjs(
			data.finalPaymentDate
		).toISOString();

		formattedTimeFinalRequestDate = finalFormatRequestTime(
			ISOFormattedFinalPaymentDate
		);

		filterUrl.push(
			`dateCreated ge ${ISOFormattedInitialPaymentDate} and dateCreated le ${formattedTimeFinalRequestDate}`
		);
	} else if (data.initialPaymentDate) {
		ISOFormattedInitialPaymentDate = dayjs(
			data.initialPaymentDate
		).toISOString();

		filterUrl.push(`dateCreated ge ${ISOFormattedInitialPaymentDate}`);
	} else if (data.finalPaymentDate) {
		ISOFormattedFinalPaymentDate = dayjs(
			data.finalPaymentDate
		).toISOString();

		formattedTimeFinalRequestDate = finalFormatRequestTime(
			ISOFormattedFinalPaymentDate
		);

		filterUrl.push(`dateCreated le ${formattedTimeFinalRequestDate}`);
	}

	return filter + filterUrl.filter((item) => item).join(' and ');
};

export async function getPaymentConfirmation(
	data: PaymentConfirmationFilterType
) {
	const filter = await createURLFilter(data);

	const response = await fetcher(`${resource}${nestedFields}${filter}`);

	return response;
}

