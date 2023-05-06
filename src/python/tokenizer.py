# tach tu tieng viet (Word Segmentation):
import underthesea
from underthesea import word_tokenize

sentence = "Với cộng đồng người Bách Việt trước đây, việc thuần hóa mèo cũng có thể theo cách thức như vậy."
word_Vi =  word_tokenize(sentence)
print(word_Vi)

#Tach cau TV (Sentence Segmentation):
from underthesea import sent_tokenize
text = 'Taylor cho biết lúc đầu cô cảm thấy ngại với cô bạn thân Amanda nhưng rồi mọi thứ trôi qua nhanh chóng. Amanda cũng thoải mái với mối quan hệ này.'
sent_Vi = sent_tokenize(text)
print(sent_Vi)

#English
from nltk.tokenize import word_tokenize
text = "God is Great! I won a lottery."
word_E = word_tokenize(text)
print(word_E)

from nltk.tokenize import sent_tokenize
text = "God is Great! I won a lottery."
sent_E = sent_tokenize(text)
print(sent_E)