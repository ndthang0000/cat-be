#pip install python-docx
#pip install deep-translator
import docx
from deep_translator import GoogleTranslator
#deep_translator dung gg API


#test Translate 
#---------------------------------------------------

#translated = GoogleTranslator(source='auto', target='vi').translate("keep it up, you are awesome")
#print(translated)

# default return type is a list
#langs_list = GoogleTranslator().get_supported_languages()  # output: [arabic, french, english etc...]
#print(langs_list)
#langs_dict = GoogleTranslator().get_supported_languages(as_dict=True)  # output: {arabic: ar, french: fr, english:en etc...}
#print(langs_dict)


#-----------------------------------------------------------------------------------------
# Mở file Docx gốc và file Docx mới : anylanguage! =)))
docx_file = docx.Document(r"uploads\1683339435548-MSSV.docx")
new_docx_file = docx.Document()
# Dịch văn bản từ file Docx gốc sang tiếng Việt và lưu vào file Docx mới
all_paras = docx_file.paragraphs
print(len(all_paras))
for paragraph in docx_file.paragraphs:
    #print(paragraph.text)
    #print("-----------------------")
    text = paragraph.text
    translated_text = GoogleTranslator(source='auto', target='en').translate(text)
    new_docx_file.add_paragraph(translated_text)

# Lưu trữ đối tượng Docx mới vào file Docx mới
new_docx_file.save('uploads/new.docx')


#------------------------------------------------------------------
#for Pdf:
#pip install PyPDF2
import PyPDF2
from deep_translator import GoogleTranslator

# Mở file PDF gốc và file PDF mới
pdf_file = open(r'uploads\simplePdf.pdf', 'rb')
new_pdf_file = open('uploads/new.pdf', 'wb')

# Tạo đối tượng PDF và đối tượng trang mới
pdf_reader = PyPDF2.PdfFileReader(pdf_file)
pdf_writer = PyPDF2.PdfFileWriter()

# Dịch văn bản từ file PDF gốc sang tiếng Việt và lưu vào file PDF mới

for page_num in range(pdf_reader.numPages):
    page = pdf_reader.getPage(page_num)
    text = page.extractText()
    translated_text = GoogleTranslator(source='auto', target='vi').translate(text)
    page.mergePage(PyPDF2.pdf.PageObject.createTextObject(None, translated_text))
    pdf_writer.addPage(page)

# Lưu trữ đối tượng PDF mới vào file PDF mới
pdf_writer.write(new_pdf_file)

# Đóng các file
pdf_file.close()
new_pdf_file.close()