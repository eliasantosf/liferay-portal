/* eslint-disable @liferay/portal/no-global-fetch */
/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

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

const getData = (user, fieldName) => {
  const field = user?.customFields.find((field) => field.name === fieldName);

  return field?.customValue?.data || null;
};

const init = async () => {
  const user = await getUser();
  const grant = getData(user, 'Grant');
  const hoursOfService = getData(user, 'Hours of Service');

  document.getElementById("grant").innerHTML = Liferay.Util.escape(`Available grant value: ${grant}`);
  document.getElementById("service").innerHTML = Liferay.Util.escape(`Hours of services available: ${hoursOfService}`);
};

init();



