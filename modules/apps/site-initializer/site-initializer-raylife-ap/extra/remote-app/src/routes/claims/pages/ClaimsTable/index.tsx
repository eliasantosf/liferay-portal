/* eslint-disable no-console */
/**
 * Copyright (c) 2000-present Liferay, Inc. All rights reserved.
 *
 * This library is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Lesser General Public License as published by the Free
 * Software Foundation; either version 2.1 of the License, or (at your option)
 * any later version.
 *
 * This library is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Lesser General Public License for more
 * details.
 */

import ClayButton from '@clayui/button';
import ClayIcon from '@clayui/icon';
import {ClayPaginationWithBasicItems} from '@clayui/pagination';
import ClayPaginationBar from '@clayui/pagination-bar';
import {useEffect, useState} from 'react';

import Header from '../../../../common/components/header';
import Table from '../../../../common/components/table';
import {getPolicyById} from '../../../../common/services';
import {getClaims} from '../../../../common/services/Claim';
import formatDate from '../../../../common/utils/dateFormatter';

const ClaimsTable = () => {
	const [dataClaims, setDataClaims] = useState<TableContent[]>([]);
	const [totalPages, setTotalPages] = useState<number>(0);
	const [pageSize, setPageSize] = useState<number>(5);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [page, setPage] = useState<number>(1);
	const [firstPaginationLabel, setFirstPaginationLabel] = useState<number>(1);
	const [secondPaginationLabel, setSecondPaginationLabel] = useState<number>(
		1
	);

	const HEADERS = [
		{
			greyColor: true,
			key: 'dateField',
			value: 'Date Field',
		},
		{
			greyColor: true,
			key: 'productName',
			value: 'Product',
		},
		{
			bold: true,
			key: 'claimNumber',
			type: 'link',
			value: 'Claim Number',
		},
		{
			greyColor: true,
			key: 'policyNumber',
			value: 'Policy Number',
		},
		{
			greyColor: true,
			key: 'claimName',
			value: 'Name',
		},
		{
			greyColor: true,
			key: 'claimStatus',
			type: 'status',
			value: 'Status',
		},
	];

	const PARAMETERS = {
		page: '0',
		pageSize: '0',
	};

	type TableContent = {[keys: string]: string};

	PARAMETERS.pageSize = pageSize.toString();
	PARAMETERS.page = page.toString();

	const getProductName = async (policyId: number) => {
		const policy = await getPolicyById(policyId);
		const productName = policy?.data?.productName;

		return productName;
	};

	useEffect(() => {
		getClaims(PARAMETERS).then((results) => {
			const claimList: TableContent[] = [];
			results?.data?.items.forEach(async (currentClaim: any) =>
				claimList.push({
					claimName: 'mudar',
					claimNumber: currentClaim?.id,
					claimStatus: currentClaim?.claimStatus.name,
					dateField: formatDate(
						new Date(currentClaim?.dateCreated),
						true
					),
					policyNumber:
						currentClaim?.r_policyToClaims_c_raylifePolicyId,
					productName: await getProductName(
						currentClaim?.r_policyToClaims_c_raylifePolicyId
					),
				})
			);
			setDataClaims(claimList);

			const totalCount = results?.data?.totalCount;
			setTotalCount(totalCount);

			const totalPages = Math.ceil(totalCount / pageSize);
			setTotalPages(totalPages);

			const firstPaginationLabel = (page - 1) * pageSize + 1;
			setFirstPaginationLabel(firstPaginationLabel);

			const secondPaginationLabel =
				totalCount > page * pageSize ? page * pageSize : totalCount;
			setSecondPaginationLabel(secondPaginationLabel);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [page, pageSize]);

	const title = `Claims (${totalCount})`;

	return (
		<>
			<div>
				<Header className="mb-5 pt-3 px-4" title={title} />

				<Table actions={[]} data={dataClaims} headers={HEADERS} />
			</div>
			<div className="d-flex justify-content-between mt-3">
				<ClayPaginationBar>
					<ClayPaginationBar.DropDown
						items={[
							{
								label: '5',
								onClick: () => {
									setPageSize(5);
									setPage(1);
								},
							},
							{
								label: '10',
								onClick: () => {
									setPageSize(10);
									setPage(1);
								},
							},
							{
								label: '20',
								onClick: () => {
									setPageSize(20);
									setPage(1);
								},
							},
							{
								label: '30',
								onClick: () => {
									setPageSize(30);
									setPage(1);
								},
							},
							{
								href: '#3',
								label: '50',
								onClick: () => {
									setPageSize(50);
									setPage(1);
								},
							},
							{
								label: '75',
								onClick: () => {
									setPageSize(75);
									setPage(1);
								},
							},
						]}
						trigger={
							<ClayButton displayType="unstyled">
								{pageSize}
								&nbsp;Entries
								<ClayIcon symbol="caret-double-l" />
							</ClayButton>
						}
					/>

					<ClayPaginationBar.Results>
						Showing {firstPaginationLabel}
						&nbsp;to&nbsp;
						{secondPaginationLabel} of {totalCount} entries.
					</ClayPaginationBar.Results>
				</ClayPaginationBar>

				<ClayPaginationWithBasicItems
					activePage={page}
					ellipsisBuffer={2}
					onPageChange={(page: number) => setPage(page)}
					totalPages={totalPages}
				/>
			</div>
		</>
	);
};

export default ClaimsTable;
