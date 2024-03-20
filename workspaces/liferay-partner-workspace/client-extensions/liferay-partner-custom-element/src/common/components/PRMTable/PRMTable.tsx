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

interface RowStructure {
	id?: number;
	[key: string]: any;
}

type ChildrenRender<T> = ((item: T) => React.ReactElement) & string;

const PRMTable = ({
	className,
	columns,
	customClickOnRow,
	rows,
}: TableProps<RowStructure>) => {
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
					)) as ChildrenRender<TableColumn<RowStructure>>
				}
			</Head>

			<Body defaultItems={rows}>
				{
					((row) => (
						<Row items={columns}>
							{
								((column) => {
									const data = row[column.columnKey];

									return (
										<Cell
											key={`${row.id}:${column.columnKey}`}
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
								}) as ChildrenRender<TableColumn<RowStructure>>
							}
						</Row>
					)) as ChildrenRender<RowStructure>
				}
			</Body>
		</Table>
	);
};

export default PRMTable;
