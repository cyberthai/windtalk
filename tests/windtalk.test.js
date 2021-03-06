import { expose, link } from '../index.js';

let isSetup = false;
const frameLinks = [];

const ref = {
  reflection: ''
};

function ensureSetup() {
  if (!isSetup) {
    for (let i = 0; i < 3; i++) {
      frameLinks.push(link(document.getElementById(`if${i + 1}`).contentWindow));
    }
    expose(ref, document.getElementById(`if2`).contentWindow);
    expose(ref, document.getElementById(`if3`).contentWindow);
    isSetup = true;
  }
}

ensureSetup();

describe('Expose function', function () {
  it('Frame1 - sum of arguments', async function () {
    const remote = frameLinks[0];
    const result = await remote(2, 3);
    chai.expect(result).to.equal(5);
  });
});

describe('Expose object', function () {
  it('Frame2 - product of arguments', async function () {
    const remote = frameLinks[1];
    const result = await remote.multiply(2, 3);
    chai.expect(result).to.equal(6);
  });
  it('Frame3 - product of arguments', async function () {
    const remote = frameLinks[2];
    const result = await remote.multiply(4, 7);
    chai.expect(result).to.equal(28);
  });
});

describe('Duplex', function () {
  it('Frame2 - reflection', async function () {
    ref.reflection = 'Hello world';
    const remote = frameLinks[1];
    const result = await remote.reflect();
    chai.expect(result).to.equal('Hello world');
  });
  it('Frame3 - reflection', async function () {
    ref.reflection = 'Jingle Bells';
    const remote = frameLinks[2];
    const result = await remote.reflect();
    chai.expect(result).to.equal('Jingle Bells');
  });
});