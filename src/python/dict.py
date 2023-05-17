from requests import get
from urllib.parse import quote
from bs4 import BeautifulSoup
import requests


def get_translate(inputtext):
    try:
        url = 'https://dictionary.cambridge.org/vi/dictionary/english-vietnamese/'+inputtext
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


test = get_translate("heroin")
print(test)
