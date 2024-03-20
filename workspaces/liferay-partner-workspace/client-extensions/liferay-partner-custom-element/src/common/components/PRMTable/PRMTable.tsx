/**
 * SPDX-FileCopyrightText: (c) 2000 Liferay, Inc. https://liferay.com
 * SPDX-License-Identifier: LGPL-2.1-or-later OR LicenseRef-Liferay-DXP-EULA-2.0.0-2023-06
 */

import {Body, Cell, Head, Row, Table} from '@clayui/core';

import TableColumn from '../../interfaces/tableColumn';

interface TableProps<T> {
	className?: string;
	columns: TableColumn<T>[];
	customClickOnRow?: (item: T) => void;
	rows: T[];
}

type ChildrenRender<T> = ((item: T) => React.ReactElement) & string;

const PRMTable = <T extends unknown>({
	className,
	columns,
	customClickOnRow,
	rows,
}: TableProps<T>) => {
	return (
		<Table
			borderless
			className={className}
			columnsVisibility={false}
			size="sm"
		>
			<Head items={columns}>
				{
					((item) => (
						<Cell key={item.columnKey}>{item.label}</Cell>
					)) as ChildrenRender<TableColumn<T>>
				}
			</Head>

			<Body defaultItems={rows}>
				{
					((row) => (
						<Row items={columns}>
							{
								((column) => {
									const data: any =
										row[column.columnKey as keyof T];

									return (
										<Cell
											key={`${
												(row as {RANDOM_ID: string})[
													'RANDOM_ID'
												]
											}:${column.columnKey}`}
											onClick={() => {
												if (customClickOnRow) {
													return customClickOnRow(
														row
													);
												}
											}}
										>
											{column.render
												? column.render(data, row, 0)
												: data}
										</Cell>
									);
								}) as ChildrenRender<TableColumn<T>>
							}
						</Row>
					)) as ChildrenRender<T>
				}
			</Body>
		</Table>
	);
};

export default PRMTable;
