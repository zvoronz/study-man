import React from 'react';
import './App.css';
import chemicalBooklet from './chemicalBooklet';
import biologyBooklet from './biologyBooklet';
import Question from './components/Question';
import QuizResults from './components/QuizResults';
import { Button, Card, CardTitle, Input,
         InputGroup, InputGroupAddon, CardBody }
from 'reactstrap';
import Switch from 'react-switch';
import Timer from 'react-compound-timer';

function checkIfHasLeastOneCorrect(answers) {
  for (let i = 0; i < answers.length; ++i) {
    if (answers[i].isCorrect) {
      return true;
    }
  }
  return false;
}

function getQuestionWithNAnswers(booklet, index, answersAmount) {
  let question = {...booklet.questions[index]};
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

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function getQuestionsFromList(booklet, list, answersAmount) {
  let questions = [];
  shuffle(list);
  for(const index of list) {
    let question = getQuestionWithNAnswers(booklet, index - 1, answersAmount);
    questions.push(question);
  }
  return questions;
}

class App extends React.Component {
  questions = [];
  myHistory = [];
  currentRender = () => {return('');}

  constructor(props) {
    super();
    this.currentRender = this.renderMainMenu;
    const urlParams = new URLSearchParams(window.location.search);
    const isDebug = urlParams.has('debug');
    this.isAndroid = props.isAndroid;
    this.state = {checked: false,
                  first:0,
                  last:0,
                  questions:100,
                  questionsInRange:0,
                  isDebug:isDebug,
                  answersAmount:isDebug ? 8 : 4,
                  currentQuestion: 0,
                  questionsList: "",
                  checkedList: false
                };
  }

  componentDidMount() {
    document.addEventListener('backbutton', this.onHWBackButton);
    window.addEventListener('popstate', this.onPopState);
  }

  onPopState = (e) => {
    let state = e.state;
    console.log('popped state: ' + state);
    if (this.myHistory.length > 0) {
      let pg = this.myHistory.pop();
      window.history.pushState(this.myHistory, null);
      if (pg === 'quiz')
      {
        this.currentRender = this.renderMainMenu;
        this.setState({currentQuestion: 0});
      }
    }
    else {
      window.history.go(-1);
    }
  }

  onHWBackButton = () => {
    if (this.currentRender === this.renderQuiz)
    {
      navigator.notification.confirm(
          'Did you want stop quiz and return to main menu?', // message
          this.onDialogEvent,    // callback to invoke with index of button pressed
          'Attention!',          // title
          ['NO','STOP']          // buttonLabels
      );
    }
    else if (this.currentRender === this.renderResults)
    {
      this.onResultsOk();
    }
    else if (this.currentRender === this.renderMainMenu)
    {
      navigator.app.exitApp();
    }
  }

  onDialogEvent = (index) => {
    if (index === 2)
    {
      this.onResultsOk();
    }
  }

  onQuestionAnswered = (key, answers) => {
    for (let i = 0; i < this.questions.length; ++i) {
      if (key === this.questions[i].key) {
        this.questions[i]['answers'] = answers;
      }
    }
  }

  onNextQuestion = () => {
    let newState = {currentQuestion: this.state.currentQuestion + 1};
    this.setState(newState);
  }

  onPriviousQuestion = () => {
    let newState = {currentQuestion: this.state.currentQuestion - 1};
    this.setState(newState);
  }

  renderQuizBrowser = () => {
    this.myHistory.push('quiz');
    window.history.replaceState(this.myHistory, null);
    return (<>
        {this.questions.map((item, index) => <Question key={item.key}
                                            index={index + 1}
                                            bookletId={item.key}
                                            question={item.body}
                                            answers={item.answers}
                                            onQuestionAnswered={this.onQuestionAnswered}/>)}
        <div className='d-flex flex-row wa-900px mx-auto'>
          <Button color='success flex-fill' onClick={() => {
            this.currentRender = this.renderResults;
            const elapsedTime = document.getElementById('timer').innerText;
            this.setState({elapsedTime: elapsedTime});
            window.scrollTo(0, 0);
          }} >Result</Button>
        </div>
      </>
    );
  }

  renderQuizAndroidButtons = () => {
    const previosLbl = "<- Previous";
    const nextLbl = "Next ->";
    if (this.state.currentQuestion === 0) {
      return <Button color='primary flex-fill' onClick={this.onNextQuestion} > {nextLbl} </Button>
    }
    else if (this.state.currentQuestion === this.questions.length - 1) {
    return (<>
      <Button color='primary flex-fill mr-1' onClick={this.onPriviousQuestion} > {previosLbl} </Button>
      <Button color='success flex-fill' onClick={() => {
            this.currentRender = this.renderResults;
            const elapsedTime = document.getElementById('timer').innerText;
            this.setState({elapsedTime: elapsedTime});
            window.scrollTo(0, 0);
          }} >Result</Button>
        </>);
    }
    else {
      return (<>
        <Button color='primary flex-fill mr-1' onClick={this.onPriviousQuestion} > {previosLbl} </Button>
        <Button color='primary flex-fill ml-1' onClick={this.onNextQuestion} > {nextLbl} </Button>
        </>);
    }
  }

  renderQuizAndroid = () => {
    let item = this.questions[this.state.currentQuestion];
    return (<>
        <Question key={item.key}
                  index={this.state.currentQuestion + 1}
                  bookletId={item.key}
                  question={item.body}
                  answers={item.answers}
                  onQuestionAnswered={this.onQuestionAnswered}/>
        <div className='d-flex flex-row wa-900px fixed-bottom mx-auto'>
          {this.renderQuizAndroidButtons()}
        </div>
      </>
    );
  }

  renderQuiz = () => {
    return (
      <div className='content'>
        <Card className='mx-auto mt-5 wa-900px'>
          <CardTitle className='text-center h1'>{this.bookletName}</CardTitle>
        </Card>
        <Card className='mx-auto mt-2 wa-900px sticky-top text-center h3'>
          <CardBody id='timer'>
            <Timer formatValue={(value) => `${(value < 10 ? `0${value}` : value)}`} >
              <Timer.Hours />:
              <Timer.Minutes />:
              <Timer.Seconds />
            </Timer>
          </CardBody>
        </Card>
        {(this.isAndroid) ? this.renderQuizAndroid() : this.renderQuizBrowser()}
      </div>
    );
  }

  onResultsOk = () => {
    this.currentRender = this.renderMainMenu;
    this.setState({currentQuestion: 0});
  }

  renderResults = () => {
    return (
      <QuizResults questions={this.questions} onResultsOk={this.onResultsOk} elapsedTime={this.state.elapsedTime}/>
    );
  }

  handleRangeSwitch = () => {
    let newState = {checked: !this.state.checked,
                    checkedList: false}
    this.setState(newState);
  }

  handleListSwitch = () => {
    let newState = {checkedList: !this.state.checkedList,
                    checked: false}
    this.setState(newState);
  }

  onSpinChange = (event) => {
    let value = event.currentTarget.value;
    let newState = {};
    newState[event.currentTarget.id] = parseInt(value);
    this.setState(newState);
  }

  onListChange = (event) => {
    let value = event.currentTarget.value;
    let newState = {};
    let numbers = /[0-9\s]*/;
    if (value.match(numbers)) {
      let matched = [...value.matchAll(/[0-9]+/g)];
      let hasInvalid = false;
      for(let number of matched) {
        let intNumber = parseInt(number[0]);
        if (intNumber > 750 || intNumber <= 0) {
          hasInvalid = true;
          break;
        }
      }
      if (!hasInvalid) {
        newState[event.currentTarget.id] = value;
      }
    }
    this.setState(newState);
  }

  renderInputControls = () => {
    if (this.state.checked) {
      if (this.isAndroid) {
        return (<>
          <Input id='questionsInRange' className='mr-2' value={this.state.questionsInRange ? this.state.questionsInRange : ''} placeholder='# Questions' min={1} max={750} type='number' step='1' onChange={this.onSpinChange}/>
          <InputGroup className='my-1'>
            <Input id='first' className='ml-7' value={this.state.first ? this.state.first : ''} placeholder='# First Q' min={1} max={749} type='number' step='1' onChange={this.onSpinChange} />
            <Input className='mr-2' id='last' value={this.state.last ? this.state.last : ''} placeholder='# Last Q' min={2} max={750} type='number' step='1' onChange={this.onSpinChange} />
          </InputGroup>
        </>);
      }
      else {
        return (<>
          <Input id='questionsInRange' value={this.state.questionsInRange ? this.state.questionsInRange : ''} placeholder='# Questions' min={1} max={750} type='number' step='1' onChange={this.onSpinChange}/>
          <Input id='first' value={this.state.first ? this.state.first : ''} placeholder='# First Q' min={1} max={749} type='number' step='1' onChange={this.onSpinChange} />
          <Input className='mr-2' id='last' value={this.state.last ? this.state.last : ''} placeholder='# Last Q' min={2} max={750} type='number' step='1' onChange={this.onSpinChange} />
        </>);
      }
    }
    else {
      return (<Input className='mr-2' disabled id='questions' value={this.state.questions ? this.state.questions : ''} placeholder='# Questions' min={1} max={100} type='number' step='1' onChange={this.onSpinChange}/>);
    }
  }

  renderMainMenu = () => {
    window.history.pushState(this.myHistory, null);
    let questionsList = [];
    if (this.state.checkedList) {
      let matched = [...this.state.questionsList.matchAll(/[0-9]+/g)];
      for(let number of matched) {
        let intNumber = parseInt(number[0]);
        questionsList.push(intNumber);
      }
    }
    const isButtonDisabled = (this.state.checked && ((this.state.last <= this.state.first) || (this.state.questionsInRange > (this.state.last - this.state.first + 1)))) || (this.state.checkedList && questionsList.length === 0);
    
    return (
      <div className='content mx-auto wa-900px'>
        <Card className='mt-5'>
          <CardTitle className='text-center h1'>Quiz 2019</CardTitle>
          <InputGroup className='mt-5 mb-1'>
            <Switch
              checked={this.state.checked}
              onChange={this.handleRangeSwitch}
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
            {this.renderInputControls()}
          </InputGroup>
          <InputGroup className='mb-5'>
            <Switch
              checked={this.state.checkedList}
              onChange={this.handleListSwitch}
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
            <Input id='questionsList' className='mr-2' disabled={!this.state.checkedList} value={this.state.checkedList ? this.state.questionsList : ''} placeholder='Enter list of question numbers' type='text' onChange={this.onListChange}/>
          </InputGroup>
          <Button className='mx-2' color='primary' disabled={isButtonDisabled} 
            onClick={() => {
              if (this.state.checked) {
                this.questions = getNRangedQuestions(chemicalBooklet, this.state.questionsInRange, this.state.first, this.state.last, this.state.answersAmount);
              }
              else if (this.state.checkedList) {
                this.questions = getQuestionsFromList(chemicalBooklet, questionsList, this.state.answersAmount);
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
              if (this.state.checkedList) {
                this.questions = getQuestionsFromList(biologyBooklet, questionsList, this.state.answersAmount);
              }
              else {
                this.questions = getNQuestions(biologyBooklet, this.state.questions, this.state.answersAmount);
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
