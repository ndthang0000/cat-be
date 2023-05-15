#------------------------------------------------------------------
#for Pdf: https://pypdf2.readthedocs.io/en/stable/index.html
#pip install PyPDF2
import PyPDF2
from PyPDF2 import PdfFileReader, PdfFileWriter
from PyPDF2 import PageObject
from deep_translator import GoogleTranslator

# Mở file PDF gốc và file PDF mới
pdf_file = open(r'uploads\simplePdf.pdf', 'rb')
new_pdf_file = open('uploads/new.pdf', 'wb')

# Tạo đối tượng PDF và đối tượng trang mới
pdf_reader = PyPDF2.PdfReader(pdf_file)
pdf_writer = PyPDF2.PdfWriter()

# Dịch văn bản từ file PDF gốc sang tiếng Việt và lưu vào file PDF mới

page = pdf_reader.pages[0]
text = page.extract_text()
#print(text)
translated_text = GoogleTranslator(source='auto', target='vi').translate(text)
pagetmp = PyPDF2.PageObject.create_blank_page(100,100,0)
# Add the text to the page
pagetmp.text = translated_text
page.merge_page(pagetmp)
pdf_writer.add_page(page)

# Lưu trữ đối tượng PDF mới vào file PDF mới
pdf_writer.write(new_pdf_file)

# Đóng các file
pdf_file.close()
new_pdf_file.close()