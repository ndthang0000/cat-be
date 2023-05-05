
import sys
from nltk.tokenize import sent_tokenize


def calculate(a):
  result = a*a
  print(result)


def sentence_tokenize(test):
  print('Day la argument1 ', test)


def main():
  if sys.argv[1] == 'sentence_tokenize':
    sentences = sent_tokenize(sys.argv[2])
    for sentence in sentences:
      print(sentence)
  elif sys.argv[1] == 'calculate':
    calculate(int(sys.argv[2]))


main()
