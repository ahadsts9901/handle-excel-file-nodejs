import express from "express"
import { upload } from "../multer.mjs"
import { readFile } from 'fs/promises';
import XLSX, { utils } from "xlsx"
import { data } from "../data-to-excel.mjs";
import fs from "fs"

const router = express.Router()

router.post('/excel-to-data', upload.any(), async (req, res) => {

    try {

        const excelFile = req?.files[0];

        if (!excelFile) {
            return res.status(400).send({
                message: "'no file uploaded'"
            });
        }

        const filePath = excelFile.path
        const bufferData = await readFile(filePath);
        const workbook = XLSX.read(bufferData, { type: 'buffer' });
        const sheet = workbook.Sheets.Sheet1

        res.send({
            message: "excel file readed",
            sheet: sheet
        })

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error');
    }
});

router.post('/data-to-excel', (req, res) => {

    if (!data || !Array.isArray(data) || data.length === 0) {
        return res.status(400).send({
            message: 'invalid data format or empty data array'
        });
    }

    const workbook = utils.book_new();
    const sheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook, sheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    const filePath = "./data-to-excel.xlsx"

    fs.writeFile(filePath, excelBuffer, (err) => {

        if (err) {
            console.error('Error writing Excel file:', err);
            return res.status(500).send({
                message: 'Error generating Excel file'
            });
        }

        console.log('Excel file saved successfully:', filePath);

        res.send({
            message: 'Excel file generated and saved successfully',
            filePath: filePath
        });
    });

});

export default router