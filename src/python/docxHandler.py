#pip install python-docx
#pip install deep-translator
#pip install google-cloud-translate
import docx
from deep_translator import GoogleTranslator
from underthesea import word_tokenize
from underthesea import sent_tokenize
#from google.cloud import translate_v2 as translate
import translators as ts
#translation = ts.translate_text(para.text, to_language=target_language)
import sys
import os
import docx
import docx2txt
#deep_translator dung gg API

#---------------------------------------------------------
#function 1: function tách câu từ file : input là tên file , output là array đã các câu được tách
def sent_from_file(filename):
    docx_file = docx.Document(r"uploads/"+filename)
    sent = []
    for paragraph in docx_file.paragraphs:
        text = paragraph.text
        sent_Vi = sent_tokenize(text)
        sent = sent + sent_Vi
    return sent 


#---------------------------------------------------------
#function 2: function dịch 1 câu: input là 1 câu kem theo ngon ngu can dich; output là 1 câu đã đc dịch
def translate_sent(sent_byte,language):
    byte=sent_byte.encode('latin-1').decode('utf-8').encode('utf-8')
    sent=byte.decode('utf-8')
    translated_text = ts.translate_text(sent, to_language=language)
    return translated_text


#---------------------------------------------------------
#function 3: function dịch nhiều câu: input là array các câu chưa dịch va ngon ngu can dich, output là mảng các câu đc dịch
def translate_sents(sents,language):
    translated_sents = []
    for sent in sents:
        translated_sent = translate_sent(sent,language)
        translated_sents.append(translated_sent)
    return translated_sents

#---------------------------------------------------------
#function 4: tao file moi 
def translate_docx_file(docx_file, target_language):
    # Load the original DOCX file
    doc = docx.Document(docx_file)
    all_paras = doc.paragraphs
    print(len(all_paras))
    # Create a new document to store the translated text
    new_doc = docx.Document()

    
    

    # Iterate through each paragraph in the original document
    for para in doc.paragraphs:
        # Translate the text of the paragraph to the target language
        para.is_
        print(para.text)
        print(len(para.text))
        if len(para.text ) > 5:
            translation = ts.translate_text(para.text, to_language=target_language)
            print(translation)
            # Create a new paragraph in the new document with the translated text
            new_para = new_doc.add_paragraph(translation)
        
        else:
            print("empty")
            new_para = new_doc.add_paragraph(para)

        # Copy any formatting from the original paragraph to the new paragraph
        new_para.style = para.style

    # Iterate through each table in the original document
    for table in doc.tables:
        # Create a new table in the new document with the same number of rows and columns as the original table
        new_table = new_doc.add_table(rows=len(table.rows), cols=len(table.columns))

        # Iterate through each cell in the original table and copy its contents to the corresponding cell in the new table
        for i, row in enumerate(table.rows):
            for j, cell in enumerate(row.cells):
                new_table.cell(i, j).text = cell.text

    # Save the new document as a DOCX file with the same name as the original file, but with "_translated" appended to the end
    new_doc.save(docx_file[:-5] + '_translated.docx')

#---------------------------------------------------------
#translate_docx_file("uploads/vi.docx","vi")
#---------------------------------------------------------


'''
print(sys.argv)

def main():
    if sys.argv[1] == "sent_from_file":
        print(sys.argv[2])
        sent = sent_from_file(sys.argv[2])
        print(sent)
    elif sys.argv[1] == "translate_sent":
        print(sys.argv[2])
        translated_sent = translate_sent(sys.argv[2],sys.argv[3])
        print(translated_sent)
    elif sys.argv[1] == "translate_sents":
        print(sys.argv[2])
        translated_sents = translate_sents(sys.argv[2],sys.argv[3])
        print(translated_sents)
    else:
        print("error")


main()

'''


#---------------------------------------------------------
#de day neu can xem lai


#test Translate 
#---------------------------------------------------

#translated = GoogleTranslator(source='auto', target='vi').translate("keep it up, you are awesome")
#print(translated)

# default return type is a list
#langs_list = GoogleTranslator().get_supported_languages()  # output: [arabic, french, english etc...]
#print(langs_list)
#langs_dict = GoogleTranslator().get_supported_languages(as_dict=True)  # output: {arabic: ar, french: fr, english:en etc...}
#print(langs_dict)

'''
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
'''
'''
import os
import docx
import docx2txt

# Extract the images to img_folder/
docx2txt.process('document.docx', 'img_folder/')

# Open you .docx document
doc = docx.Document('document.docx')

# Save all 'rId:filenames' relationships in an dictionary named rels
rels = {}
for r in doc.part.rels.values():
    if isinstance(r._target, docx.parts.image.ImagePart):
        rels[r.rId] = os.path.basename(r._target.partname)

# Then process your text
for paragraph in doc.paragraphs:
    # If you find an image
    if 'Graphic' in paragraph._p.xml:
        # Get the rId of the image
        for rId in rels:
            if rId in paragraph._p.xml:
                # Your image will be in os.path.join(img_path, rels[rId])
    else:
        # It's not an image
'''
#test

#filename = "Hello.docx"
#language="vi"
#sent = sent_from_file(filename)
#print(sent)
#print("-------------------------------------------------")
#sent='Cuộc phản công mùa xuân thành công sẽ quyết định vận mệnh cuộc chiến'
'''
sent="tôi đi học"
print(sent.encode('utf-8'))

print("-------------------------------------------------")
print("bạn bị cái lỗi này: ")
sent_1 = 't\xc3\xb4i \xc4\x91i h\xe1\xbb\x8dc'
print(sent_1)

print("-------------------------------------------------")
print("đây là cách fix lỗi:")
byte_string_with_b = sent_1.encode('latin-1').decode('utf-8').encode('utf-8')
print(byte_string_with_b)
print(byte_string_with_b.decode('utf-8'))

'''


#sent='t\xc3\xb4i \xc4\x91i h\xe1\xbb\x8dc'
#translated_sent = translate_sent(sent,language)
#print(translated_sent)

#enc=translated_sent.encode('utf-8')
#byte_string = "M\xe1\xbb\x99t cu\xe1\xbb\x99c ph\xe1\xba\xa3n c\xc3\xb4ng m\xc3\xb9a xu\xc3\xa2n th\xc3\xa0nh c\xc3\xb4ng s\xe1\xba\xbd quy\xe1\xba\xbft \xc4\x91\xe1\xbb\x8bnh s\xe1\xbb\x91 ph\xe1\xba\xadn c\xe1\xbb\xa7a cu\xe1\xbb\x99c chi\xe1\xba\xbfn"

#byte_string_with_b = byte_string.encode('latin-1').decode('utf-8').encode('utf-8')
#print(byte_string_with_b)
#print(byte_string_with_b.decode('utf-8'))
