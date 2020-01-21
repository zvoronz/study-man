import React from 'react';
import {
    Button, Card, CardTitle, CardText, CardBody
  } from'reactstrap';
import Question from './Question';

class QuizResults extends React.Component
{
    constructor(props)
    {
        super(props);

        this.state = {
            answers: props.answers
        };
    }

    render()
    {
        let {questions, elapsedTime} = this.props;

        let pointsReached = 0, pointsFull = 0, trueAnswers = 0;
        questions.map((question) => {
            let fullAnswerCorrect = true;
            question.answers.map((answer) => {
                if (answer.isSelected && answer.isCorrect) {
                    pointsReached += 1;
                }
                else if (answer.isSelected && !answer.isCorrect) {
                    pointsReached -= 1;
                    fullAnswerCorrect = false;
                }

                if (answer.isCorrect) {
                    pointsFull += 1;
                    if (!answer.isSelected) {
                        fullAnswerCorrect = false;
                    }
                }
                return answer;
            });
            question.allCorrect = fullAnswerCorrect;
            if (fullAnswerCorrect) {
                trueAnswers += 1;
            }
            return question;
        });
        let truePercents = Math.round(trueAnswers / questions.length * 100);
        return (
            <div className='content'>
              <Card className='mx-auto mt-5 wa-900px'>
                <CardTitle className='text-center h1'>Results</CardTitle>
                <CardBody>
                    <CardText className='text-center h4'>Points: {pointsReached}/{pointsFull}</CardText>
                    <CardText className='text-center h4'>Score: {truePercents}%</CardText>
                    <CardText className='text-center h4'>Elapsed time: {elapsedTime}</CardText>
                </CardBody>
              </Card>
              {questions.map((item, index) => <Question key={item.key}
                                                  index={index + 1}
                                                  bookletId={item.key}
                                                  question={item.body}
                                                  answers={item.answers}
                                                  isCorrect={item.allCorrect}
                                                  isStatic />)}
              <div className='d-flex flex-column'>
                <Button color='primary mx-auto mb-5 wa-900px'
                        onClick={() => this.props.onResultsOk()}>
                    Ok
                </Button>
              </div>
            </div>
          );
    }
}

export default QuizResults;