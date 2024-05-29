import type { MpSdk } from 'embedtypes/sdk';
import questions from './questions.json';
import { connect } from '../common';
import '../common/main.css';
import './style.css';

type Question = {
  title: string;
  description: string | null;
  answer: string;
  choices: Array<string>;
  tag: MpSdk.Tag.TagData;
  ele?: HTMLDivElement | null;
};

const container = document.querySelector('.container');

// Create UI
document.addEventListener('DOMContentLoaded', () => {
  let rightOverlay = document.createElement('div');
  rightOverlay.classList.add('right-overlay');
  container.appendChild(rightOverlay);

  let arrow = document.createElement('div');
  arrow.classList.add('overlay-arrow', 'arrow');
  rightOverlay.appendChild(arrow);

  let title = document.createElement('h4');
  title.classList.add('title');
  title.innerHTML = 'Nearby Questions';
  rightOverlay.appendChild(title);

  let tags = document.createElement('div');
  tags.classList.add('nearby-tags');
  rightOverlay.appendChild(tags);

  tags.style.display = 'none';
  title.addEventListener('click', () => {
    tags.style.display = tags.style.display === 'flex' ? 'none' : 'flex';
    arrow.classList.toggle('active');
  });
});

async function getModelSweeps(mpSdk: MpSdk) {
  const sweeps: MpSdk.Dictionary<MpSdk.Sweep.ObservableSweepData> = await new Promise((resolve, reject) => {
    const sub = mpSdk.Sweep.data.subscribe({
      onCollectionUpdated: function (collection) {
        resolve(collection);
        sub.cancel();
      },
    });
  });
  return sweeps;
}

async function loadedShowcaseHandler(mpSdk: MpSdk) {
  // Initial setup
  await removeAllTags(mpSdk);
  questions.forEach(async (question: any) => {
    question.tag.sid = await mpSdk.Tag.add(question.tag);
  });
  let sweeps = await getModelSweeps(mpSdk);
  let questiontags = questions.map((question) => question.tag);

  // Listeners
  let currSweep: MpSdk.Sweep.ObservableSweepData;
  mpSdk.Sweep.current.subscribe(function (newSweep) {
    if (newSweep.id !== '') {
      currSweep = newSweep;
      updateNearbyTags(newSweep.id);
    }
  });

  let prevState: MpSdk.Tag.OpenTags = undefined;
  mpSdk.Tag.openTags.subscribe({
    onChanged(newState) {
      if (prevState !== undefined && newState.hovered !== prevState.hovered) {
        if (newState.hovered) {
          let existing_overlay = document.querySelector('.popup-overlay');
          if (existing_overlay) existing_overlay.remove();
          popupQuestion(newState.hovered);
        }
        prevState = newState;
      }
    },
  });

  function euclideanDistance(pos1: MpSdk.Vector3, pos2: MpSdk.Vector3) {
    return Math.sqrt(Math.pow(pos1.x - pos2.x, 2) + Math.pow(pos1.y - pos2.y, 2) + Math.pow(pos1.z - pos2.z, 2));
  }
  // Functions
  function createTagElements(tags: Array<MpSdk.Tag.Descriptor>, container: HTMLDivElement) {
    for (const [id, tag] of Object.entries(tags)) {
      let question = getQuestion(tag.id);

      let tagEle = document.createElement('div');
      tagEle.classList.add('tag-info');
      tagEle.setAttribute('id', tag.id);
      // To satisfy typescript validation
      tagEle.setAttribute('data-key', id);

      let arrow = document.createElement('div');
      arrow.classList.add('arrow');
      tagEle.insertAdjacentElement('beforeend', arrow);

      let title = document.createElement('p');
      title.classList.add('title');
      title.innerText =
        tag.label + ` (${euclideanDistance(tag.anchorPosition, currSweep.position).toPrecision(2)}m away)`;
      tagEle.insertAdjacentElement('beforeend', title);

      let goto = document.createElement('p');
      goto.classList.add('goto');

      goto.innerText =
        question.hasOwnProperty('ele') &&
        (question.ele as any).querySelector('.popup-status').innerHTML !== 'Unanswered'
          ? 'Answered'
          : 'Answer Question';

      tagEle.insertAdjacentElement('beforeend', goto);

      let description = document.createElement('p');
      description.classList.add('description');
      description.innerText = question.tag ? question.tag.description : tag.description;
      description.style.display = 'none';
      tagEle.insertAdjacentElement('beforeend', description);

      container.insertAdjacentElement('beforeend', tagEle);
    }
    return container;
  }

  function getTagProximity(sweepID: string) {
    let sameLevelTags = [];
    let newSweep = sweeps[sweepID];
    sameLevelTags = questiontags.filter((tag) => Math.abs(tag.anchorPosition.y - newSweep.position.y) <= 2.25);

    const sortFunc = (a: any, b: any) => a.distance - b.distance;
    sameLevelTags.sort(sortFunc);
    return sameLevelTags.length >= 5 ? sameLevelTags.slice(0, 4) : sameLevelTags;
    //return sameLevelTags;
  }

  function updateNearbyTags(sweepID: string) {
    let sameLevelTags = getTagProximity(sweepID);
    let container: HTMLDivElement = document.querySelector('.nearby-tags');
    container.innerHTML = '';
    let ele: HTMLDivElement = createTagElements(sameLevelTags, container);
    setTagListeners(ele);
  }

  function getQuestion(tagID: string) {
    return questions.filter((question) => question.tag.id == tagID)[0] as Question;
  }

  function createQuestionElement(question: Question) {
    // Container
    let container = document.createElement('div');
    container.classList.add('popup-overlay');

    // Exit
    let exit = document.createElement('div');
    exit.classList.add('popup-exit');
    exit.innerText = 'X';
    container.insertAdjacentElement('beforeend', exit);

    // Title
    let title = document.createElement('h3');
    title.classList.add('popup-title');
    title.innerText = question.title;
    container.insertAdjacentElement('beforeend', title);

    // Question status
    let status = document.createElement('h4');
    status.classList.add('popup-status');
    status.innerText = 'Unanswered';
    container.insertAdjacentElement('beforeend', status);

    // Choices
    let description = document.createElement('ul');
    description.classList.add('choices');
    question.choices.forEach((choice, i) => {
      // List item
      let li = document.createElement('li');

      // Label
      let label = document.createElement('label');
      label.setAttribute('for', `${i}`);
      label.innerText = choice;

      // Radio button
      let choiceBtn = document.createElement('input');
      choiceBtn.setAttribute('type', 'radio');
      choiceBtn.setAttribute('id', `${i}`);
      choiceBtn.setAttribute('value', `${i}`);
      choiceBtn.setAttribute('name', 'choice');

      li.insertAdjacentElement('beforeend', choiceBtn);
      li.insertAdjacentElement('beforeend', label);
      description.insertAdjacentElement('beforeend', li);
    });
    container.insertAdjacentElement('beforeend', description);

    return container;
  }

  function setPopupListeners(questionEle: HTMLElement, question: Question) {
    let choices = questionEle.querySelectorAll('input');
    let status: HTMLElement = questionEle.querySelector('.popup-status');
    let exit = questionEle.querySelector('.popup-exit');
    exit.addEventListener('click', () => {
      questionEle.remove();
    });

    choices.forEach((choice) => {
      choice.addEventListener('change', (newVal: any) => {
        // TODO: propogate to right overlay
        if (newVal.target.value === question.answer) {
          status.innerText = 'Correct!';
          status.style.color = 'rgb(103, 255, 103)';
          question.tag.color = { r: 0, g: 1, b: 0 };
          mpSdk.Tag.editColor(question.tag.id, { r: 0, g: 1, b: 0 }).catch(console.error);
        } else {
          status.innerText = 'Incorrect';
          status.style.color = 'rgb(255, 103, 103)';
          question.tag.color = { r: 1, g: 0, b: 0 };
          mpSdk.Tag.editColor(question.tag.id, { r: 1, g: 0, b: 0 }).catch(console.error);
        }
        mpSdk.Tag.editBillboard(question.tag.id, {
          description: status.innerText,
        }).catch(console.error);
        question.tag.description = status.innerText;
        updateNearbyTags(currSweep.id);
      });
    });
  }

  function popupQuestion(tagID: string) {
    let question = getQuestion(tagID);
    let questionEle;
    if (question.hasOwnProperty('element')) {
      questionEle = question.ele;
    } else {
      questionEle = createQuestionElement(question);
      setPopupListeners(questionEle, question);
      question.ele = questionEle;
    }
    container.insertAdjacentElement('beforebegin', questionEle);
  }

  function setTagListeners(container: HTMLElement) {
    container.childNodes.forEach((tagEle: HTMLElement) => {
      let goto = tagEle.querySelector('.goto');
      goto.addEventListener('click', () => {
        let existing_overlay = document.querySelector('.popup-overlay');
        if (existing_overlay) existing_overlay.remove();
        mpSdk.Mattertag.navigateToTag(tagEle.id, mpSdk.Mattertag.Transition.FADEOUT).catch(console.error);
        popupQuestion(tagEle.id);
      });

      let description: HTMLElement = tagEle.querySelector('.description');
      let arrow = tagEle.querySelector('.arrow');
      let title = tagEle.querySelector('.title');
      title.addEventListener('click', () => {
        description.style.display = description.style.display === 'inherit' ? 'none' : 'inherit';
        arrow.classList.toggle('active');
      });
    });
  }

  async function removeAllTags(mpSdk: MpSdk) {
    const tags: MpSdk.Dictionary<MpSdk.Tag.TagData> = await new Promise((resolve, reject) => {
      const sub = mpSdk.Tag.data.subscribe({
        onCollectionUpdated: function (collection) {
          resolve(collection);
          sub.cancel();
        },
      });
    });
    mpSdk.Tag.remove(...Object.keys(tags));
    return tags;
  }
}

const main = async () => {
  const sdk: MpSdk = await connect({
    urlParams: {
      m: 'iL4RdJqi2yK',
      help: '0',
      hr: '0',
      play: '1',
      qs: '1',
      brand: '0',
      useLegactyIds: '0',
    },
  });
  loadedShowcaseHandler(sdk);
};
main();
