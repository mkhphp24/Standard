
    /*
     * (c) MajPanel <https://github.com/MajPanel/>
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */


    import React, {useEffect, useState} from 'react';
    import Paper from '@material-ui/core/Paper';
    import Button from '@material-ui/core/Button';
    import * as Config from './Config/Config';
    import * as ConfigGridTabel from './Config/ConfigGridTabel';
    import InsertDataRow from "./Component/Insert/InsertDataRow";
	import { useConfirm } from "material-ui-confirm";

    import {
        CustomPaging,
        FilteringState,
        IntegratedSelection,
        IntegratedSorting,
        PagingState,
        RowDetailState,
        SelectionState,
        SortingState
    } from '@devexpress/dx-react-grid';

    import {
        Grid,
        PagingPanel,
        Table,
        TableFilterRow,
        TableHeaderRow,
        TableRowDetail,
        TableSelection,
        VirtualTable,
    } from '@devexpress/dx-react-grid-material-ui'
    import {Loading} from '../../loading/loading';


    import ContentDetailRow from "./Component/ContentDetailRow";
    import Dialog from "@material-ui/core/Dialog";
    import AppBar from "@material-ui/core/AppBar";
    import Toolbar from "@material-ui/core/Toolbar";
    import IconButton from "@material-ui/core/IconButton";
    import CloseIcon from "@material-ui/icons/Close";


    const URL = Config.PATH_DATAGrid_API;

    /**
     * @author Majid Kazerooni <support@majpanel.com>
     */

    export default () => {

            const [columns] = useState(ConfigGridTabel.Fields);
            const [rows, setRows] = useState([]);
            const [totalCount, setTotalCount] = useState(0);
            const [ConfirmOpen, setConfirmOpen] = useState(false);
            const [reload, setreload] = useState(0);

            const [pageSize] = useState(6);
            const [currentPage, setCurrentPage] = useState(0);
            const [filters, setFilters] = useState([]);
            const [sorts, setSort] = useState('');
            const [loading, setLoading] = useState(false);
            const [lastQuery, setLastQuery] = useState();
            const [relodFlag, setrelodFlag] = useState('0');
            const [selectedRowsData, setSelectedRowsData] = useState([])

            const getRowId = row => row.id;

            const ContentDetail = ({row, props}) => (
                <ContentDetailRow dataRow={row} title={''} onChangeStatus={handlereload}/>
            );


            const getQueryString = () => {
                let filter = filters.reduce((acc, {columnName, value, operation}) => {
                    acc.push(`[${columnName} , ${operation} , ${encodeURIComponent(value)}]`);
                    return acc;
                }, []).join(',"and",');

                if (filters.length > 1) {
                    filter = `[${filter}]`;
                }

                return `${URL}?filter=${filter}&sort=${sorts}&limit=${pageSize}&offset=${pageSize * currentPage}&reload=${relodFlag}`;
            };

            const loadData = () => {
                const queryString = getQueryString();
                if (queryString !== lastQuery && !loading) {
                    setLoading(true);
                    fetch(queryString)
                        .then(response => response.json())
                        .then(({data, totalCount: newTotalCount}) => {
                            setRows(data);
                            setTotalCount(Number(newTotalCount));
                            setLoading(false);
                            setSelection([]);
                        })
                        .catch(() => setLoading(false));
                    setLastQuery(queryString);
                }

            };


            const [open, setOpen] = useState(false);
            const [selection, setSelection] = useState([]);

            const changeSelection = (selection) => {
                setSelection(selection);
                let result = selection.map((value) => rows[value].id);
                setSelectedRowsData(result);
            }

            const handlereload = () => {
                setrelodFlag(Math.random());
            };

            //=================================================
            const handleClose = () => {
                setOpen(false);
                handlereload();
            };
            //=================================================sort
            const SortingControl = (sortitem) => {
                setSort('[' + sortitem[0].columnName + ',' + sortitem[0].direction + ']');
            }

            //=================================================
			const confirm = useConfirm();

			const deleteItem= () =>{

				const requestOptions = {
					method: 'DELETE',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ itemsSelect: selectedRowsData })
				};

				fetch(Config.PATH_DELETE_API, requestOptions)
				.then(result => result.json())
				.then((result) => {
					setrelodFlag(Math.random());
				});

				//alert(selectedRowsData);
			}

			const handleDelete = () => {
				if(selection.length !== 0) {
					confirm({
						description: `This will permanently delete ` + selection.length
							+ ' item '
					})
					.then(() => {
						deleteItem()
					})
					.catch(() => console.log("Deletion cancelled."));
				}
			};
            //================================================
            const insertItem = () => {
                setOpen(true);
            }
            //=================================================
            useEffect(() => loadData());
            return (
                <div>
              <span>

                Total rows selected:
                  {' '}
                  <Button variant="contained" color="secondary" onClick={handleDelete}>
                        Delete Item {selection.length}
                  </Button>
                  {' '}
                  <Button variant="contained" color="primary" onClick={insertItem}>
                        Insert New Item
                  </Button>

              </span>

                    <Paper style={{position: 'relative'}}>
                        <Grid
                            rows={rows}
                            columns={columns}
                        >

                            <RowDetailState/>
                            <SortingState
                                onSortingChange={SortingControl}
                            />
                            <IntegratedSorting/>
                            <Table columnExtensions={[{columnName: "empresa", width: 120}]}/>
                            <SelectionState
                                selection={selection}
                                onSelectionChange={changeSelection}
                            />
                            <IntegratedSelection/>
                            <PagingState
                                currentPage={currentPage}
                                onCurrentPageChange={setCurrentPage}
                                pageSize={pageSize}
                            />
                            <CustomPaging
                                totalCount={totalCount}
                            />
                            <FilteringState
                                onFiltersChange={setFilters}
                            />
                            <VirtualTable/>
                            <TableHeaderRow showSortingControls/>
                            <TableRowDetail
                                contentComponent={ContentDetail}
                            />
                            <TableSelection showSelectAll/>
                            <TableFilterRow showFilterSelector={true}/>
                            <PagingPanel/>
                        </Grid>

                        {loading && <Loading/>}
                    </Paper>
                    <Dialog fullScreen open={open}>
                        <AppBar>
                            <Toolbar>
                                <IconButton edge="start" color="inherit" aria-label="close" onClick={handleClose}>
                                    <CloseIcon/>
                                </IconButton>
                            </Toolbar>
                        </AppBar>
                        <InsertDataRow idRow={'0'} reload={open}/>
                    </Dialog>
                </div>
            );
        };
