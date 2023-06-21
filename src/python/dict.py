from requests import get
from urllib.parse import quote
from bs4 import BeautifulSoup
import requests


def get_translate(languageToLanguage,inputtext):
    try:
        url = 'https://dictionary.cambridge.org/vi/dictionary/'+languageToLanguage+'/'+inputtext
        user_agent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.63 Safari/537.36"
        headers = {'User-Agent': user_agent}
        web_request = requests.get(url, headers=headers)
        a = BeautifulSoup(web_request.text, "html.parser")
        #a = a.find_all("div", class_="entry-body")
        a = a.find_all("div", class_="sense-body dsense_b")
        #a = a.find_all("div", class_="pr dictionary")
        #print(a)
        if len(a) == 0:
            return None
        allresult = []

        #find all result definition in html code
        for i in range(len(a)):
            result = a[i].find_all("div", class_="def ddef_d db")
            if len(result) == 0:
                #continue
                #print("No result")
                result = a[i].find_all("div", class_="def-body ddef_b ddef_b-t")
                if len(result) == 0:
                    #print("No result 02 ")
                    continue
            

            result_dict = {}
            result_dict['terms'] = []
            result_dict['example'] = []
            result_dict['meaning'] = []
        
            for j in range(len(result)):
                #print(result[j].text)
                if len(result[j].text) == 0:
                    result[j].text="No term"

                result_dict['terms'].append(result[j].text)
            allresult.append(result_dict)
        #print(allresult)

        #find all result example in html code
        for i in range(len(a)):
            result = a[i].find_all("span", class_="eg deg")
            if len(result) == 0:
                continue
            for j in range(len(result)):
                allresult[i]['example'].append(result[j].text)
        #print(allresult)

        #find the meaning of definition in span.trans.dtrans
        for i in range(len(a)):
            result = a[i].find_all("span", class_="trans dtrans")
            if len(result) == 0:
                result = a[i].find_all("span", class_="trans dtrans dtrans-se")
                if len(result) == 0:
                    continue
            for j in range(len(result)):
                allresult[i]['meaning'].append(result[j].text)
        #print(allresult)





        #result = allresult[0]["terms"][:1]
        #result_dict = {}
        #result_dict['result']=result
        #result_dict['all_result']=allresult
        #result_dict['detect_language']='en'
        #result_dict['revise']=None
        return allresult
    
    except Exception:
        return None


class Dict:
    def __init__(self, Word="", Pronounce="", Description="", Data=""):
        self.Word = Word
        self.Pronounce = Pronounce
        self.Description = Description
        self.Data = Data

def generate_av():
    filename = r"uploads/anhviet109k.txt"
    html = ""
    idx = 0
    result = []
    d = Dict(Word="")
    description_state = 0

    with open(filename, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()

            if "@" in line:
                line = line.replace("@", "")
                if len(d.Word) > 0:
                    d.Data = html
                    result.append(d)


                items = line.split("/")
                data_word = items[0].strip()
                if len(items) > 1:
                    data_pronounce = items[1].strip()
                else:
                    data_pronounce = ""

                description_state = 0
                d = Dict(Word=data_word, Pronounce=data_pronounce)
                html = f"{data_word} /{data_pronounce}/"

            elif line.startswith("*  "):
                line = line[3:]
                html += f"\n{line}"

                if description_state == 0:
                    description_state = 1
                    d.Description = line

            elif line.startswith("- "):
                line = line[2:]
                html += f"\n    {line}"

                if description_state <= 1:
                    description_state = 2
                    d.Description += f"\n   {line}"

            elif line.startswith("="):
                line = line[1:]
                line = line.replace("+", ":")  # Replace "+" with ":"
                html += f"\n        {line}"

                if description_state <= 1:
                    description_state = 2
                    d.Description += f"\n   {line}"

    if len(d.Word) > 0:
        d.Data = html
        result.append(d)

    return result

def generate_va():
    filename = r"uploads/vietanh.txt"
    html = ""
    idx = 0
    result = []
    d = Dict(Word="")
    description_state = 0

    with open(filename, "r", encoding="utf-8") as file:
        for line in file:
            line = line.strip()

            if "@" in line:
                line = line.replace("@", "")
                if len(d.Word) > 0:
                    d.Data = html
                    result.append(d)


                items = line.split("/")
                data_word = items[0].strip()
                if len(items) > 1:
                    data_pronounce = items[1].strip()
                else:
                    data_pronounce = ""

                description_state = 0
                d = Dict(Word=data_word, Pronounce=data_pronounce)
                html = f"{data_word} /{data_pronounce}/"

            elif line.startswith("*  "):
                line = line[3:]
                html += f"\n{line}"

                if description_state == 0:
                    description_state = 1
                    d.Description = line

            elif line.startswith("- "):
                line = line[2:]
                html += f"\n    {line}"

                if description_state <= 1:
                    description_state = 2
                    d.Description += f"\n   {line}"

            elif line.startswith("="):
                line = line[1:]
                line = line.replace("+", ":")  # Replace "+" with ":"
                html += f"\n        {line}"

                if description_state <= 1:
                    description_state = 2
                    d.Description += f"\n   {line}"

    if len(d.Word) > 0:
        d.Data = html
        result.append(d)

    return result

def search_word(languagetolanguage,word):
    if languagetolanguage == "en-vi":
        dictionary = generate_av()
    elif languagetolanguage == "vi-en":
        dictionary = generate_va()
    else:
        print("Error: Invalid language.")
        return None
    results = []

    for entry in dictionary:
        if entry.Word.lower() == word.lower():
            results.append(entry)

    if len(results) == 0:
        print("No results found.")
    else:
        for result in results:
            print("Word:", result.Word)
            print("Pronounce:", result.Pronounce)
            print("Description:", result.Description)
            print("Data:", result.Data)
            print()
    




#file_path = r"uploads\anhviet109K.txt"
#file_path = r"uploads\vietanh.txt"
search_word("vi-en","ám")



#test = get_translate("english-french","example")
#print(test)
#print(test[0]['terms'][0])
#print(test[0]['example'][0])
#print(test[0]['meaning'][0])
#print(test[1]['example'][1])
#test= get_translate("helpless")
#print(test)
