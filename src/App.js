import React from 'react';
import './App.css';
import chemicalBooklet from './chemicalBooklet';
import biologyBooklet from './biologyBooklet';
import Question from './components/Question';
import QuizResults from './components/QuizResults';
import { Button, Card, CardTitle, Input,
         InputGroup, InputGroupAddon }
from 'reactstrap';
import Switch from 'react-switch';

function checkIfHasLeastOneCorrect(answers) {
  for (let i = 0; i < answers.length; ++i) {
    if (answers[i].isCorrect) {
      return true;
    }
  }
  return false;
}

function getQuestionWithNAnswers(booklet, index, answersAmount) {
  let question = booklet.questions[index];
  question.key = parseInt(question.key);
  let answers = [];  
  if (answersAmount < question.answers.length) {
    for(let i = 0; i < answersAmount;) {
      let answer = question.answers[Math.floor(Math.random() * question.answers.length)];
      if (answers.find((element) => element.key === answer.key) === undefined) {
        ++i;
        answer['isSelected'] = false;        
        answers.push(answer);

        if (i === answersAmount) {
          const noAnyCorrect = !checkIfHasLeastOneCorrect(answers);
          if (noAnyCorrect) {
            answers = [];
            i = 0;
          }
        }
      }
    }
    question.answers = answers;
  }
  return question;
}

function getNQuestions(booklet, amount, answersAmount) {
  let questions = [];
  for(let i = 0; i < amount;) {
    let question = getQuestionWithNAnswers(booklet, Math.floor(Math.random() * booklet.questions.length), answersAmount);
    if (questions.find((element) => element.key === question.key) === undefined) {
      ++i;
      questions.push(question);
    }
  }
  return questions;
}

function getNRangedQuestions(booklet, amount, start, end, answersAmount) {  
  let questions = [];
  
  if (amount === 0 || isNaN(amount)) {
    amount = end - start + 1;
  }

  for(let i = 0; i < amount;) {
    let question = getQuestionWithNAnswers(booklet, (start - 1) + Math.floor(Math.random() * (end - start + 1)), answersAmount);
    if (questions.find((element) => element.key === question.key) === undefined) {
      ++i;
      questions.push(question);
    }
  }
  return questions;
}

class App extends React.Component {
  questions = [];

  currentRender = () => {return('');}

  constructor() {
    super();
    this.currentRender = this.renderMainMenu;
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.has('debug');
    this.state = {checked: false,
                  first:0,
                  last:0,
                  questions:100,
                  questionsInRange:0,
                  isDebug:isDebug,
                  answersAmount:isDebug ? 8 : 4
                };
  }

  onQuestionAnswered = (key, answers) => {
    for (let i = 0; i < this.questions.length; ++i) {
      if (key === this.questions[i].key) {
        this.questions[i]['answers'] = answers;
      }
    }
  }

  renderQuiz = () => {
    return (
      <div className='content'>
        <Card className='mx-auto mt-5 wa-900px'>
          <CardTitle className='text-center h1'>{this.bookletName}</CardTitle>
        </Card>
        {this.questions.map((item, index) => <Question key={item.key}
                                            index={index + 1}
                                            bookletId={item.key}
                                            question={item.body}
                                            answers={item.answers}
                                            onQuestionAnswered={this.onQuestionAnswered}/>)}
        <div className='d-flex flex-column'>
          <Button color='success mx-auto mb-5 wa-900px' onClick={() => {
            this.currentRender = this.renderResults;
            this.setState({});
          }} >Result</Button>
        </div>
      </div>
    );
  }

  onResultsOk = () => {
    this.currentRender = this.renderMainMenu;
    this.setState({});
  }

  renderResults = () => {
    return (
      <QuizResults questions={this.questions} onResultsOk={this.onResultsOk}/>
    );
  }

  handleChange = () => {
    let newState = {checked: !this.state.checked}
    this.setState(newState);
  }

  onSpinChange = (event) => {
    let value = event.currentTarget.value;
    let newState = {};
    newState[event.currentTarget.id] = parseInt(value);
    this.setState(newState);
  }

  f = () => {
    if (this.state.checked) {
      return (<>
        <Input id='questionsInRange' value={this.state.questionsInRange ? this.state.questionsInRange : ''} placeholder='# Questions' min={1} max={750} type='number' step='1' onChange={this.onSpinChange}/>
        <Input id='first' value={this.state.first ? this.state.first : ''} placeholder='# First Q' min={1} max={749} type='number' step='1' onChange={this.onSpinChange} />
        <Input className='mr-2' id='last' value={this.state.last ? this.state.last : ''}placeholder='# Last Q' min={2} max={750} type='number' step='1' onChange={this.onSpinChange} />
      </>);
    }
    else {
      return (<Input className='mr-2' disabled id='questions' value={this.state.questions ? this.state.questions : ''} placeholder='# Questions' min={1} max={100} type='number' step='1' onChange={this.onSpinChange}/>);
    }
  }

  renderMainMenu = () => {

    const isButtonDisabled = this.state.checked && ((this.state.last <= this.state.first) || (this.state.questionsInRange > (this.state.last - this.state.first + 1)));

    return (
      <div className='content mx-auto wa-900px'>
        <Card className='mt-5'>
          <CardTitle className='text-center h1'>Quiz 2019</CardTitle>
          <InputGroup className='my-5'>
            <Switch
              checked={this.state.checked}
              onChange={this.handleChange}
              onColor='#86d3ff'
              onHandleColor='#2693e6'
              handleDiameter={30}
              uncheckedIcon={false}
              checkedIcon={false}
              boxShadow='0px 1px 5px rgba(0, 0, 0, 0.6)'
              activeBoxShadow='0px 0px 1px 10px rgba(0, 0, 0, 0.2)'
              height={20}
              width={48}
              className='react-switch'
              id='material-switch'
            />
            <InputGroupAddon addonType='prepend'>Deck of 750 questions</InputGroupAddon>
            {this.f()}
          </InputGroup>
          <Button className='mx-2' color='primary' disabled={isButtonDisabled} 
            onClick={() => {
              if (this.state.checked) {
                this.questions = getNRangedQuestions(chemicalBooklet, this.state.questionsInRange, this.state.first, this.state.last, this.state.answersAmount);
              }
              else {
                this.questions = getNQuestions(chemicalBooklet, this.state.questions, this.state.answersAmount)
              }
              this.currentRender = this.renderQuiz;
              this.bookletName = chemicalBooklet.name;
              if (this.state.isDebug) {
                this.questions.sort((a, b) => a.key < b.key ? -1 : a.key === b.key ? 0 : 1);
              }
              this.setState({});}}>
            {chemicalBooklet.name}
          </Button>
          <Button className='my-2 mx-2' color='primary' disabled={isButtonDisabled}
            onClick={() => {
              if (this.state.checked) {
                this.questions = getNRangedQuestions(biologyBooklet, this.state.questionsInRange, this.state.first, this.state.last, this.state.answersAmount);
              }
              else {
                this.questions = getNQuestions(biologyBooklet, this.state.questions, this.state.answersAmount)
              }
              this.bookletName = biologyBooklet.name;
              this.currentRender = this.renderQuiz;
              if (this.state.isDebug) {
                this.questions.sort((a, b) => a.key < b.key ? -1 : a.key === b.key ? 0 : 1);
              }
              this.setState({});}}>
            {biologyBooklet.name}
          </Button>
        </Card>
      </div>
    );
  }

  render() {
    return this.currentRender();
  }
}

export default App;
