import json
import sys

if len(sys.argv) < 2:
    print('python check.py <file for check>')
else:
    f = open(sys.argv[1], 'r')
    booklet = json.load(f)

    print(booklet['name'])
    invalidQuestions = []
    for question in booklet['questions']:
        hasTrueAnswer = False
        for answer in question['answers']:
            try:
                if answer['isCorrect']:
                    hasTrueAnswer = True
                    break
            except KeyError as ex:
                print("%s" % (question['key']))

        if not hasTrueAnswer:
            invalidQuestions.append(question['key'])

    if len(invalidQuestions) == 0:
        print("\tAll questions valid.")
    else:
        print("\tInvalid questions: %s" % (",".join(invalidQuestions)))