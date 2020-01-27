import React from 'react';
import {
    Button
  } from'reactstrap';

class Answer extends React.Component
{
    constructor() {
        super();
        this.state = {};
    }

    onAnswerSelected = (e) => {
        this.props.handleAnswer(this.props.answerId);
        e.target.focus = false;
    }

    render() {
        const {answer, isSelected, showAnswers, isCorrect} = this.props;
        if (showAnswers === undefined || showAnswers === false) {
            return (<Button outline={!isSelected}
                            color={isSelected ? 'primary' : 'secondary'}
                            className='mt-1'
                            onClick={this.onAnswerSelected}>
                        <span dangerouslySetInnerHTML={{__html:answer}} />
                    </Button>);
        }
        else {
            let color = isSelected ? isCorrect ? 'success' : 'danger' : 'secondary';
            return (<Button outline={!isSelected}
                        color={color}
                        className={'mt-0 disable__' + color}
                        disabled
                        active={false}>
                        <span dangerouslySetInnerHTML={{__html:answer}} />
                    </Button>);
        }
    }

}

export default Answer;