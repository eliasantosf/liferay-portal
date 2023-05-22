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

import ClayForm from '@clayui/form';
import dayjs from 'dayjs';
import {SubmitHandler, useForm} from 'react-hook-form';

import Form from '../../../common/components/Form';
import yupSchema, {yupResolver} from '../../../common/schema/yup';
import {Liferay} from '../../../common/services/liferay/liferay';
import {
	FIELDSPAYMENTREPORT,
	PaymentConfirmationFilterType,
} from '../../../types/index';

import './index.scss';
import {getPaymentConfirmation} from '../../../common/services/paymentConfirmation';

export type generatePaymentReport = typeof yupSchema.payment.__outputType;

const GenerateFinancialReport = () => {
	const redirect = `${Liferay.ThemeDisplay.getPortalURL()}/web/evp/reports`;

	const {
		clearErrors,
		formState: {errors},
		getValues,
		handleSubmit,
		register,
		setError,
		setValue,
	} = useForm<generatePaymentReport>({
		defaultValues: {
			accountNumberCR: '',
			accountNumberDB: '',
			accountTypeCR: '',
			accountTypeDB: '',
			entityName: '',
			finalPaymentDate: '',
			initialPaymentDate: '',
			territoryId: '',
		},
		resolver: yupResolver(yupSchema.payment),
	});

	const validateDate = (dateInitial: string, dateFinal: string) => {
		const regexValidate = /^[\d]{4}-[\d]{2}-[\d]{2}$/;

		if (dateInitial && dateFinal) {
			if (dateInitial > dateFinal) {
				setError(FIELDSPAYMENTREPORT.INITIALPAYMENTDATE, {
					message:
						'Initial Payment Date cannot be greater than Final Payment Date',
					type: 'custom',
				});

				return false;
			}
		}

		if (dateInitial && !regexValidate.test(dateInitial)) {
			setError(FIELDSPAYMENTREPORT.FINALPAYMENTDATE, {
				message:
					'Initial Payment Date is not recognized. Please enter a valid date',
				type: 'custom',
			});

			return false;
		}

		if (dateFinal && !regexValidate.test(dateFinal)) {
			setError(FIELDSPAYMENTREPORT.FINALPAYMENTDATE, {
				message:
					'Final Payment Date is not recognized. Please enter a valid date',
				type: 'custom',
			});

			return false;
		}

		return true;
	};

	// Exemplo com um array

const array = [1, 2, 3, 4, 5];
let soma = 0;

for (const valor of array) {
  soma += valor;
}

console.log('Soma:', soma);

// Exemplo com um objeto

const objeto = { atributo1: 10, atributo2: 20, atributo3: 30 };
soma = 0;

for (const valor of Object.values(objeto)) {
  soma += valor;
}

console.log('Soma:', soma);


	const constructionFieldsCsv = async (
		fields: PaymentConfirmationFilterType[]
	) => {
		let fieldsCsv = '';

		const headers = [
			'Moviment Date',
			'Short Description',
			'Account Type DB',
			'Account Number DB',
			'Description',
			'Value',
			'Account Type CR',
			'Account Number CR',
			'Department',
			'Territory ID',
		];

		fieldsCsv += `${headers.join(',')}\n`;

		for (const field of fields) {

			let sum: string = '0';
			const body = [
				dayjs(field?.paymentDate).format('MM-DD-YYYY'),
				`EVP Request ${field?.r_requestId_c_evpRequestId} - Employee: ${field?.r_requestId_c_evpRequest?.creator?.name}`,
				field?.r_financial_c_evpFinancial?.accountNumberDB,
				field?.r_financial_c_evpFinancial?.accountNumberDB,
				`EVP Request ${field?.r_requestId_c_evpRequestId} - Employee: ${field?.r_requestId_c_evpRequest?.creator?.name}`,
				Number(sum += field?.paymentValue),
				field?.r_financial_c_evpFinancial?.accountTypeCR,
				field?.r_financial_c_evpFinancial?.accountNumberCR,
				' ',
				field?.r_financial_c_evpFinancial?.territoryId,

			];

			fieldsCsv += `${body.join(',')}\n`;
		}

		const hiddenElement = document.createElement('a');
		hiddenElement.href =
			'data:text/csv;charset=utf-8,' + encodeURI(fieldsCsv);

		hiddenElement.target = '_blank';
		hiddenElement.download = 'payment-report.csv';
		hiddenElement.click();
	};

	const onSubmit: SubmitHandler<generatePaymentReport> = async (
		data: any
	) => {
		const dateCheck = validateDate(
			data.initialPaymentDate,
			data.finalPaymentDate
		);

		if (dateCheck === false) {
			return;
		}

		await getPaymentConfirmation(data).then((response) => {
			setTimeout(() => {
				constructionFieldsCsv(response?.items);
			}, 1000);
		});
	};

	const formProps = {
		errors,
		register,
		required: true,
	};

	return (
		<>
			<ClayForm className="mb-9">
				<div className="row">
					<div className="col">
						<Form.DatePicker
							clearErrors={clearErrors}
							errors={formProps.errors}
							id="initialPaymentDate"
							label="Initial Payment Date"
							{...register('initialPaymentDate')}
							name="initialPaymentDate"
							placeholder="YYYY-MM-DD"
							setValue={setValue}
							value={getValues('initialPaymentDate') as string}
						/>
					</div>

					<div className="col">
						<Form.DatePicker
							clearErrors={clearErrors}
							errors={formProps.errors}
							id="finalPaymentDate"
							label="Final Payment Date"
							{...register('finalPaymentDate')}
							name="finalPaymentDate"
							placeholder="YYYY-MM-DD"
							setValue={setValue}
							value={getValues('finalPaymentDate') as string}
						/>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<Form.Input
							{...formProps}
							label="Territory Id"
							min={0}
							name="territoryId"
							placeholder="Territory ID"
							type="string"
						/>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<Form.Input
							{...formProps}
							label="Entity Name"
							min={0}
							name="entityName"
							placeholder="Entity Name"
							type="string"
						/>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<Form.Input
							{...formProps}
							label="Account Number CR"
							min={0}
							name="accountNumberCR"
							placeholder="Account Number CR"
							type="string"
						/>
					</div>

					<div className="col">
						<Form.Input
							{...formProps}
							label="Account Number DB"
							min={0}
							name="accountNumberDB"
							placeholder="Account Number DB"
							type="string"
						/>
					</div>
				</div>

				<div className="row">
					<div className="col">
						<Form.Input
							{...formProps}
							label="Account Type CR"
							min={0}
							name="accountTypeCR"
							placeholder="Account Type CR"
							type="string"
						/>
					</div>

					<div className="col">
						<Form.Input
							{...formProps}
							label="Account Type DB"
							min={0}
							name="accountTypeDB"
							placeholder="Account Type DB"
							type="string"
						/>
					</div>
				</div>

				<div className="mt-5 row">
					<div className="col">
						<div className="col d-flex justify-content-start p-0">
							<Form.Button
								className="px-4"
								displayType="secondary"
								onClick={() => {
									window.location.href = redirect;
								}}
							>
								Back
							</Form.Button>
						</div>
					</div>

					<div className="col">
						<div className="col d-flex justify-content-end">
							<Form.Button
								className="px-4"
								displayType="primary"
								onClick={handleSubmit(onSubmit)}
							>
								Generate
							</Form.Button>
						</div>
					</div>
				</div>
			</ClayForm>
		</>
	);
};

export default GenerateFinancialReport;
