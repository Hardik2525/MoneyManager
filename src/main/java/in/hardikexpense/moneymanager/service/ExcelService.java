package in.hardikexpense.moneymanager.service;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class ExcelService {

    public byte[] create(String sheetName, List<ExcelRow> rows) {
        try (XSSFWorkbook workbook = new XSSFWorkbook();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet(sheetName);
            Row header = sheet.createRow(0);
            String[] columns = {"Name", "Category", "Date", "Amount"};
            for (int i = 0; i < columns.length; i++) {
                header.createCell(i).setCellValue(columns[i]);
            }

            int rowIndex = 1;
            for (ExcelRow item : rows) {
                Row row = sheet.createRow(rowIndex++);
                row.createCell(0).setCellValue(item.name() == null ? "" : item.name());
                row.createCell(1).setCellValue(item.category() == null ? "" : item.category());
                row.createCell(2).setCellValue(item.date() == null ? "" : item.date().toString());
                row.createCell(3).setCellValue(item.amount() == null ? 0 : item.amount().doubleValue());
            }

            for (int i = 0; i < columns.length; i++) {
                sheet.autoSizeColumn(i);
            }
            workbook.write(out);
            return out.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to create Excel file", e);
        }
    }

    public record ExcelRow(String name, String category, LocalDate date, BigDecimal amount) {}
}
