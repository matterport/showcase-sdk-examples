import { sdkKey } from '@mp/common';
import { MpSdk } from '../bundle/sdk';

import './style.css';

declare global {
  interface Window {
    MP_SDK: {
      connect(iframe: HTMLIFrameElement, key: string, unused: ''): Promise<MpSdk>;
    }
  }
}

const sid = `iL4RdJqi2yK`;
const params = `&hl=2&play=1&qs=1&applicationKey=${sdkKey}`;

type Question = {
  title: string;
  description: string | null;
  answer: string;
  choices: string[];
  tag: Partial<MpSdk.Tag.TagData>;
}

document.addEventListener('DOMContentLoaded', () => {
  let iframe = document.querySelector<HTMLIFrameElement>('.showcase');
  iframe.setAttribute('src', `https://my.matterport.com/show/?m=${sid}${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));
});

function createTag(question: Question, mpSdk: MpSdk) {
  mpSdk.Tag.add(question.tag as MpSdk.Tag.Descriptor)
    .then(sid => {
      question.tag.id = sid[0];
    })
    .catch(console.error);
}

function createQuestionElement(question: Question) {
  let choices = question.choices;

  // Create question container
  let questionElement = document.createElement('div');
  questionElement.setAttribute('class', 'question');
  questionElement.classList.add('unselected');

  // Create title
  let title = document.createElement('h3');
  title.setAttribute('class', 'question_title')
  title.innerText = question.title;
  questionElement.insertAdjacentElement('beforeend', title);

  // Create form wrapper
  let form = document.createElement('form');
  questionElement.insertAdjacentElement('beforeend', form);

  // Create choice wrapper
  let choice_list = document.createElement('ul');
  choice_list.setAttribute('class', 'choices');
  form.insertAdjacentElement('beforeend', choice_list);

  // Create choices
  choices.forEach((choice, i) => {
    let item = document.createElement('li');
    item.setAttribute('class', 'choice');

    // radio button
    let btn = document.createElement('input')
    btn.setAttribute('type', 'radio');
    btn.setAttribute('id', String(i))
    btn.setAttribute('name', 'choice');
    btn.setAttribute('value', String(i));

    // label
    let label = document.createElement('label');
    label.setAttribute('for', `${i}`);
    label.innerText = choice

    item.insertAdjacentElement('beforeend', btn)
    item.insertAdjacentElement('beforeend', label)
    choice_list.insertAdjacentElement('beforeend', item)
  });

  // Go To button
  let goToBtn = document.createElement('button');
  goToBtn.setAttribute('class', 'goto_button');
  goToBtn.innerText = 'Go to Tag'
  questionElement.insertAdjacentElement('beforeend', goToBtn);

  return questionElement
}

function updateTagColor(tag: Partial<MpSdk.Tag.TagData>, newColor: MpSdk.Color, mpSdk: MpSdk) {
  if (!tag) return;
  if (tag.hasOwnProperty('color')) {
    tag.color = newColor;
  }
  mpSdk.Tag.editColor(tag.id, newColor)
    .catch(console.error);
}

function updateTagDescription(tag: Partial<MpSdk.Tag.TagData>, newDescription: string, mpSdk: MpSdk) {
  if (!tag) return;
  if (tag.hasOwnProperty('description')) {
    tag.description = newDescription;
  }
  mpSdk.Tag.editBillboard(tag.id, { description: newDescription })
    .catch(console.error);
}

function giveQuestionListeners(question: Question, questionElement: HTMLElement, mpSdk: MpSdk) {

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
    inp.addEventListener('change', newVal => {
      let ans = document.createElement('h4');
      const id = (newVal.target as HTMLElement).getAttribute('id');
      if (id === question.answer) {
        ans.setAttribute('style', 'color: rgb(9, 179, 9); font-style: italic;');
        ans.innerText = 'Correct';
        updateTagColor(question.tag, { r: 0, g: 1, b: 0 }, mpSdk);
      } else {
        ans.setAttribute('style', 'color: rgb(179, 9, 9); font-style: italic;');
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

  let goto = questionElement.querySelector('.goto_button');
  goto.addEventListener('click', () => {
    // Legacy Method with no equivalent in Tag Namespace
    mpSdk.Mattertag.navigateToTag(question.tag.id, mpSdk.Mattertag.Transition.FADEOUT)
      .catch(console.error);
  });

}

function loadQuestions(mpSdk: MpSdk) {

  let questionsEle = document.querySelector('.questions');

  // Can also load questions from file or database
  let questions: Question[] = [
    {
      'title': 'What brand is the fridge?',
      'description': null,
      'answer': '1',
      'choices': ['GE', 'Sub-Zero', 'Kenmore', 'LG'],
      'tag': {
        'id': 'aUMYG5cfYMm',
        'label': 'What brand is the fridge?',
        'description': '',
        'anchorPosition': {
          'x': 5.314893167599408,
          'y': -0.1567343140995423,
          'z': 10.455523925678921
        },
        'color': {
          'r': 0,
          'g': 0,
          'b': 1
        },
        'stemVector': {
          'x': 0,
          'y': 0.2,
          'z': 0
        },
        'stemVisible': true
      }
    },
    {
      'title': 'How wide is the TV?',
      'description': null,
      'answer': '2',
      'choices': ["10'", "3'2\"", "6'5\"", "1'"],
      'tag': {
        'id': 'hDZVtcsGd5t',
        'label': 'How wide is the TV?',
        'description': '',
        'anchorPosition': {
          'x': 6.808068364327917,
          'y': -0.7514079923325638,
          'z': 1.2463780759085934
        },
        'color': {
          'r': 0,
          'g': 0,
          'b': 1
        },
        'stemVector': {
          'x': 0,
          'y': 0.2,
          'z': 0
        },
        'stemVisible': true
      }
    },
    {
      'title': 'What is the recommended procedure with a table during an earthquake?',
      'description': null,
      'answer': '2',
      'choices': ['Get on top of the table', 'Move the table outside', 'Get under the table', 'Get under a chandelier'],
      'tag': {
        'id': 'ehDVQ3HF1al',
        'label': 'What is the recommended procedure with a table during an earthquake?',
        'description': '',
        'anchorPosition': {
          'x': 0.4731829189866753,
          'y': -0.8998377744732301,
          'z': 5.968713694470143
        },
        'color': {
          'r': 0,
          'g': 0,
          'b': 1
        },
        'stemVector': {
          'x': 0,
          'y': 0.2,
          'z': 0
        },
        'stemVisible': true
      }
    },
    {
      'title': 'Who should you call in an emergency?',
      'description': null,
      'answer': '0',
      'choices': ['911', 'Ghostbusters', 'Grandma', 'Matterport Customer Support'],
      'tag': {
        'id': 'kMF3VzNIslo',
        'label': 'Who should you call in an emergency?',
        'description': '',
        'anchorPosition': {
          'x': 5.015846850857473,
          'y': -0.8528928246952776,
          'z': 7.197700847992113
        },
        'color': {
          'r': 0,
          'g': 0,
          'b': 1
        },
        'stemVector': {
          'x': 0,
          'y': 0.2,
          'z': 0
        },
        'stemVisible': true
      }
    },
    {
      'title': 'What color is this chair?',
      'description': null,
      'answer': '0',
      'choices': ['Red', 'Blue', 'Yellow', 'Green'],
      'tag': {
        'id': 'DsYfDW00lSB',
        'label': 'What color is this chair?',
        'description': '',
        'anchorPosition': {
          'x': 5.8739787740590685,
          'y': 2.1396123213050684,
          'z': 8.299051556795263
        },
        'color': {
          'r': 0,
          'g': 0,
          'b': 1
        },
        'stemVector': {
          'x': 0,
          'y': 0.2,
          'z': 0
        },
        'stemVisible': true
      }
    }
  ];

  questions.forEach(question => {
    createTag(question, mpSdk);
    let questionEle = createQuestionElement(question);
    questionsEle.insertAdjacentElement('beforeend', questionEle);
    giveQuestionListeners(question, questionEle, mpSdk);
  });
}

function showcaseLoader(iframe: HTMLIFrameElement) {
  try {
    window.MP_SDK.connect(iframe, sdkKey, '')
      .then(loadedShowcaseHandler)
      .catch(console.error);
  } catch (e) {
    console.error(e);
  }
}

function loadedShowcaseHandler(mpSdk: MpSdk) {
  const sub = mpSdk.Tag.data.subscribe({
    onCollectionUpdated(collection) {
      let allTagSids = Object.keys(collection);
      mpSdk.Tag.remove(...allTagSids);
      // Load questions and tags
      loadQuestions(mpSdk);
      sub.cancel();
    },
  });
}
