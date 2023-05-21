import docx
import pandas as pd
import numpy as np


#Parsing table from docx using Python
doc = docx.Document(r"uploads/"+'vi.docx')

df = pd.DataFrame()

tables = doc.tables[0]

##Getting the original data from the document to a list
ls =[]
for row in tables.rows:
    for cell in row.cells:
        for paragraph in cell.paragraphs:
            ls.append(paragraph.text)

print(ls)

def Doctable(ls, row, column):
    df = pd.DataFrame(np.array(ls).reshape(row,column))  #reshape to the table shape
    new = docx.Document()
    word_table =new.add_table(rows = row, cols = column)
    for x in range(0,row,1):
        for y in range(0,column,1):
            cell = word_table.cell(x,y)
            cell.text = df.iloc[x,y]


    return new, df
