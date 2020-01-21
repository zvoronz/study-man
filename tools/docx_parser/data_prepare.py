#-------------------------------------------------------------------------------
# Name:        data_prepare
# Purpose:     Prepare data for web application
#
# Author:      voron
#
# Created:     18/01/2020
# Copyright:   (c) voron 2020
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import mammoth
import mammoth.transforms
import docx
import codecs
import mammoth.documents
from bs4 import BeautifulSoup
import json

def process_children(children):
    for child in children:
        if type(child) is mammoth.documents.Run:
            if child.position == '-7':
                child.vertical_alignment = 'subscript'
            elif child.position == '8' or child.position == '6':
                child.vertical_alignment = 'superscript'

            child.is_bold = False

            # if child.position != None:
                # if type(child.children[0]) is mammoth.documents.Image:
                    # print "%s: %s" % ("Image",
                                    # child.position)
                # elif type(child.children[0]) is mammoth.documents.Tab:
                    # print "%s: %s" % ("Tab",
                                    # child.position)
                # else:
                    # print "%s: %s" % (child.children[0].value,
                                    # child.position)

            if child.font == 'Symbol':
                child.children[0].value =\
                    child.children[0].value.encode('ascii', 'xmlcharrefreplace')

        if hasattr(child, 'children') and len(child.children) > 0:
            process_children(child.children)

def transform_paragraph(element):
    if len(element.children) > 0:
        process_children(element.children)
    return element

def main():
    ##transform_document = mammoth.transforms.run(transform_paragraph)
    filename = 'simple-list'
    ##filename = '2'
    ##filename = '1 - CHEMISTRY BOOKLET_2019_individual applicants'
    with open(filename + '.docx', 'rb') as docx_file:
        result = mammoth.convert_to_html(docx_file, transform_document=transform_paragraph)
        html = result.value # The generated HTML
        messages = result.messages # Any messages, such as warnings during conversion

    file = codecs.open(filename + '.html', 'wb', 'utf-8')
    file.write(html)
    file.close()

    file = codecs.open(filename + '.html', 'r', 'utf-8')
    html = file.read()
    file.close()

    answers = ['empty']
    with open('answers.txt', 'r') as file_answers:
        for answer in file_answers.readlines():
            answers.append(answer.split('.')[1])

    soup = BeautifulSoup(html, 'html.parser')
    count = 1
    wrong = 0
    correct_questions = []
    for head in soup.findAll('h1'):
        if head.next_sibling.name == 'ol' and\
            len(head.next_sibling.findAll('li')) == 8:
            question = {'key':count, 'body':head.encode_contents(), 'answers':[]}
            index = 0
            for li in head.next_sibling.findAll('li'):
                answer = True if answers[count][index] == 'T' else False
                question['answers'].append({'body':li.encode_contents(),
                                            'isCorrect': answer,
                                            'key':chr(ord('a') + index)})
                index += 1
            correct_questions.append(question)
        else:
            print "%s. %s" % (str(count), head.encode_contents())
            wrong += 1

        count += 1
        
    print "wrong formatted questions = " + str(wrong)
    chemicalBooklet = json.dumps(correct_questions, indent=4, sort_keys=True)
    chemicalBooklet = '''let chemicalBooklet = {
    "name": "Chemistry Booklet 2019",
    "questions":''' + chemicalBooklet + '''};
export default chemicalBooklet;'''
    with open('study-man/src/chemicalBooklet.js', 'w') as f:
        f.write(chemicalBooklet)

if __name__ == '__main__':
    main()
