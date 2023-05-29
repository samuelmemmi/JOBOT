import {useState} from 'react'
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Pagination, Box} from "@mui/material"
import { CollapsableCard } from './CollapsableCard'


export const CardsTable = ({data}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handlePageChange = (e, page) => {
        setCurrentPage(page)
    }

    const generateTableData = (data) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentPageData = data.slice(startIndex, endIndex)
        //let tableData = []

        // for (let i = 0; i < currentPageData.length; i++) {
        //     let job = currentPageData[i]
        //     tableData.push(
        //         <TableRow key={i}>
        //             <TableCell>
        //                 <CollapsableCard
        //                     content={job.content.job}
        //                     collapsableContent={job.collapsableContent.rating}
        //                 />
        //             </TableCell>
        //         </TableRow>
        //     )
        // }
        

        return currentPageData
    }

    const tableData = generateTableData(data);

    return (
        <div className="w-50 d-flex flex-column mx-auto align-items-center justify-cotnent-center">
            <TableContainer>
                <Table >
                    <TableBody>
                        {tableData.map((job, index)  => {
                             return (
                             <TableRow key={index}>
                                <TableCell>
                                    <CollapsableCard
                                        style={{
                                            display: "flex",
                                            flexDirection: 'column',
                                            alignItems: "center",
                                            justifyContent: "Center",
                                            // margin: "0 2rem",
                                            width: "100%"
                                        }}
                                        content={job.content}
                                        collapsableContent={job.collapsableContent}
                                    />
                                </TableCell>
                            </TableRow>
                            )
                         })}
                    </TableBody>
                </Table>
            </TableContainer>

            <Pagination
                count={totalPages}
                page={currentPage}
                onChange={handlePageChange}
            />
        </div>
    )
}