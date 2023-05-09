from nltk.tokenize import sent_tokenize
import sys
print('a')


def calculate(a):
    result = a*a
    print(result)


def sentence_tokenize(text):
    print(text)
    sentences = sent_tokenize(text)
    for sentence in sentences:
        print(sentence)


print(sys.argv)


def main():
    if sys.argv[1] == 'sentence_tokenize':
        print(sys.argv[2])
        # sentence_tokenize(sys.argv[2])
    elif sys.argv[1] == 'calculate':
        calculate(int(sys.argv[2]))


main()
