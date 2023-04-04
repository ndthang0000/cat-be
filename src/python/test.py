
import sys


def calculate(a):
  result = a*a
  print(result)


def nameFunction(test1, test2):
  print('Day la argument1 ', test1)
  print('Day la argument2 ', test2)


def main():
  if sys.argv[1] == 'nameFunction':
    nameFunction(sys.argv[2], sys.argv[3])
  elif sys.argv[1] == 'calculate':
    calculate(int(sys.argv[2]))


main()
