import type { MpSdk } from 'embedtypes/sdk';
import questions from './questions.json';
import { connect } from '../common';
import '../common/main.css';
import './style.css';

type Question = {
  title: string;
  description: string | null;
  answer: string;
  choices: string[];
  tag: Partial<MpSdk.Tag.TagData>;
};

function createQuestionElement(question: Question, mpSdk: MpSdk) {
  let choices = question.choices;

  // Create question container
  let questionElement = document.createElement('div');
  questionElement.classList.add('question', 'unselected');

  // Create title
  let title = document.createElement('h3');
  title.classList.add('question_title');
  title.innerText = question.title;
  questionElement.insertAdjacentElement('beforeend', title);

  // Create form wrapper
  let form = document.createElement('form');
  questionElement.insertAdjacentElement('beforeend', form);

  // Create choice wrapper
  let choice_list = document.createElement('ul');
  choice_list.classList.add('choices');
  form.insertAdjacentElement('beforeend', choice_list);

  // Create choices
  choices.forEach((choice, i) => {
    let item = document.createElement('li');
    item.classList.add('choice');

    // radio button
    let btn = document.createElement('input');
    btn.setAttribute('type', 'radio');
    btn.setAttribute('id', String(i));
    btn.setAttribute('name', 'choice');
    btn.setAttribute('value', String(i));

    // label
    let label = document.createElement('label');
    label.setAttribute('for', `${i}`);
    label.innerText = choice;

    item.insertAdjacentElement('beforeend', btn);
    item.insertAdjacentElement('beforeend', label);
    choice_list.insertAdjacentElement('beforeend', item);
  });

  // Go To button
  let goToBtn = document.createElement('button');
  goToBtn.classList.add('class', 'goto_button');
  goToBtn.innerText = 'Go to Tag';
  questionElement.insertAdjacentElement('beforeend', goToBtn);

  goToBtn.addEventListener('click', () => {
    console.log(question.tag.id);
    // Legacy Method with no equivalent in Tag Namespace
    mpSdk.Mattertag.navigateToTag(question.tag.id, mpSdk.Mattertag.Transition.FADEOUT).catch(console.error);
  });
  return questionElement;
}

function updateTagColor(tag: Partial<MpSdk.Tag.TagData>, newColor: MpSdk.Color, mpSdk: MpSdk) {
  if (!tag) return;
  if (tag.hasOwnProperty('color')) {
    tag.color = newColor;
  }
  mpSdk.Tag.editColor(tag.id, newColor).catch(console.error);
}

function updateTagDescription(tag: Partial<MpSdk.Tag.TagData>, newDescription: string, mpSdk: MpSdk) {
  if (!tag) return;
  if (tag.hasOwnProperty('description')) {
    tag.description = newDescription;
  }
  mpSdk.Tag.editBillboard(tag.id, { description: newDescription }).catch(console.error);
}

function giveQuestionListeners(question: Question, questionElement: HTMLDivElement, mpSdk: MpSdk) {
  questionElement.addEventListener('click', () => {
    let q = document.querySelector('.selected');
    if (q) {
      q.classList.replace('selected', 'unselected');
    }
    questionElement.classList.replace('unselected', 'selected');
  });

  let choices = questionElement.querySelectorAll('.choice');

  choices.forEach((li: HTMLLIElement) => {
    let inp = li.children[0] as HTMLInputElement;
    inp.addEventListener('change', (newVal) => {
      let ans = document.createElement('h4');
      const id = (newVal.target as HTMLElement).getAttribute('id');
      console.log(id);
      ans.classList.remove('incorrect', 'correct');
      if (id === question.answer) {
        ans.classList.add('correct');
        ans.innerText = 'Correct';
        updateTagColor(question.tag, { r: 0, g: 1, b: 0 }, mpSdk);
      } else {
        ans.classList.add('incorrect');
        ans.innerText = 'Incorrect';
        updateTagColor(question.tag, { r: 1, g: 0, b: 0 }, mpSdk);
      }
      updateTagDescription(question.tag, ans.innerText, mpSdk);
      if (questionElement.children[0].tagName === 'H4') {
        questionElement.removeChild(questionElement.children[0]);
      }
      questionElement.insertAdjacentElement('afterbegin', ans);
    });
  });

}

async function loadQuestions(mpSdk: MpSdk) {
  let questionsEle = document.querySelector('.questions');

  questions.forEach(async (question: Question) => {
    //createTag(question, mpSdk);
    //let tags = await
    let tags = await mpSdk.Tag.add(question.tag as MpSdk.Tag.Descriptor);
    question.tag.id = {...tags}[0];
    let thisQuestionEle = createQuestionElement(question, mpSdk);
    questionsEle.insertAdjacentElement('beforeend', thisQuestionEle);
    giveQuestionListeners(question, thisQuestionEle as HTMLDivElement, mpSdk);
  });
}

const main = async () => {
  const sdk: MpSdk = await connect({
    urlParams: {
      m: 'iL4RdJqi2yK',
      hl: '2',
      play: '1',
      qs: '1',
    },
  });

  // Adjust the SDK Frame
  let iframe = document.querySelector('#sdk-frame');
  iframe.classList.add('showcase');

  // Create main questions container
  let questionContainer = document.createElement('div');
  questionContainer.classList.add('questions');

  let container = document.querySelector('.container');

  container.insertAdjacentElement('beforeend', questionContainer);

  const sub = sdk.Tag.data.subscribe({
    onCollectionUpdated(collection) {
      let allTagSids = Object.keys(collection);
      sdk.Tag.remove(...allTagSids);
      // Load questions and tags
      loadQuestions(sdk);
      sub.cancel();
    },
  });
};
main();
