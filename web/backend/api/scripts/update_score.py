import numpy as np
import math
import sys
import getopt


try:
    opts, dirs = getopt.getopt(sys.argv[1:], "p:c:", ["previous=", "current="])
except getopt.GetoptError:
    print('Error: --previous <previous score> --current <current score>')
    sys.exit(2)

for opt, arg in opts:
    if opt in ("-p", "--id"):
        previous = []
        for s in arg.split(','):
            previous.extend([int(s)])
        previous = np.array(previous)
        # print(previous)

    elif opt in ("-c", "--current"):
        current = []
        for s in arg.split(','):
            current.extend([int(s)])
        current = np.array(current)
        # print(current)


def softmax(input):
    sum = np.sum(np.exp(input))
    return np.exp(input) / sum


def reasonablesoftmax(input, k=5):
    temp = k * input / np.sum(input)
    return softmax(temp)


def update_score(previous_score, game_result, k=150):
    predict = reasonablesoftmax(previous_score, 8) 
    actual = reasonablesoftmax(game_result, 4)
    return np.round(previous_score + k * (actual - predict))


print(update_score(previous, current))
