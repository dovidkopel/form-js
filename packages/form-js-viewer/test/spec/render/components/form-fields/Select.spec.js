import {
  fireEvent,
  render
} from '@testing-library/preact/pure';

import Select from '../../../../../src/render/components/form-fields/Select';

import {
  createFormContainer,
  expectNoViolations
} from '../../../../TestHelper';

import { WithFormContext } from './helper';

const spy = sinon.spy;

let container;


describe('Select', function() {

  beforeEach(function() {
    container = createFormContainer();
  });

  afterEach(function() {
    container.remove();
  });


  it('should render', function() {

    // when
    const { container } = createSelect({
      value: 'german'
    });

    // then
    const formField = container.querySelector('.fjs-form-field');

    expect(formField).to.exist;
    expect(formField.classList.contains('fjs-form-field-select')).to.be.true;

    const select = container.querySelector('select');

    expect(select).to.exist;
    expect(select.id).to.equal('fjs-form-foo-Select_1');

    const label = container.querySelector('label');

    expect(label).to.exist;
    expect(label.textContent).to.equal('Language');
    expect(label.htmlFor).to.equal('fjs-form-foo-Select_1');
  });


  it('should render default value (undefined)', function() {

    // when
    const { container } = createSelect();

    // then
    const select = container.querySelector('select');

    expect(select.value).to.equal('');
  });


  it('should render <null> value', function() {

    // when
    const { container } = createSelect({
      value: null
    });

    // then
    const select = container.querySelector('select');

    expect(select.value).to.equal('');
  });


  it('should render disabled', function() {

    // when
    const { container } = createSelect({
      disabled: true
    });

    // then
    const select = container.querySelector('select');

    expect(select.disabled).to.be.true;
  });


  it('should render default value on value removed', function() {

    // given
    const props = {
      disabled: false,
      errors: [],
      field: defaultField,
      onChange: () => {},
      path: [ defaultField.key ]
    };

    const options = { container: container.querySelector('.fjs-form') };

    const { rerender } = render(
      WithFormContext(<Select { ...props } value={ 'german' } />, options)
      , options);

    // when
    rerender(
      WithFormContext(<Select { ...props } value={ null } />, options)
      , options);

    // then
    const input = container.querySelector('select');

    expect(input).to.exist;
    expect(input.value).to.equal('');
  });


  it('should render description', function() {

    // when
    const { container } = createSelect({
      field: {
        ...defaultField,
        description: 'foo'
      }
    });

    // then
    const description = container.querySelector('.fjs-form-field-description');

    expect(description).to.exist;
    expect(description.textContent).to.equal('foo');
  });


  describe('handle change (static)', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createSelect({
        onChange: onChangeSpy,
        value: 'german'
      });

      // when
      const select = container.querySelector('select');

      fireEvent.change(select, { target: { value: 'english' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: 'english'
      });
    });


    it('should clear', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createSelect({
        onChange: onChangeSpy,
        value: 'german'
      });

      // when
      const select = container.querySelector('select');

      fireEvent.change(select, { target: { value: '' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: defaultField,
        value: null
      });
    });

  });


  describe('handle change (dynamic)', function() {

    it('should handle change', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createSelect({
        onChange: onChangeSpy,
        value: 'dynamicValue1',
        field: dynamicField,
        initialData: dynamicFieldInitialData
      });

      // when
      const select = container.querySelector('select');

      fireEvent.change(select, { target: { value: 'dynamicValue2' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: dynamicField,
        value: 'dynamicValue2'
      });
    });


    it('should clear', function() {

      // given
      const onChangeSpy = spy();

      const { container } = createSelect({
        onChange: onChangeSpy,
        value: 'dynamicValue1',
        field: dynamicField,
        initialData: dynamicFieldInitialData
      });

      // when
      const select = container.querySelector('select');

      fireEvent.change(select, { target: { value: '' } });

      // then
      expect(onChangeSpy).to.have.been.calledWith({
        field: dynamicField,
        value: null
      });
    });

  });


  it('#create', function() {

    // assume
    expect(Select.type).to.eql('select');
    expect(Select.label).to.eql('Select');
    expect(Select.keyed).to.be.true;

    // when
    const field = Select.create();

    // then
    expect(field).to.eql({
      values: [
        {
          label: 'Value',
          value: 'value'
        }
      ]
    });

    // but when
    const customField = Select.create({
      custom: true
    });

    // then
    expect(customField).to.contain({
      custom: true
    });
  });


  describe('a11y', function() {

    it('should have no violations', async function() {

      // given
      this.timeout(5000);

      const { container } = createSelect({
        value: 'foo'
      });

      // then
      await expectNoViolations(container);
    });

  });

});


// helpers //////////

const defaultField = {
  id: 'Select_1',
  key: 'language',
  label: 'Language',
  type: 'select',
  values: [
    {
      label: 'German',
      value: 'german'
    },
    {
      label: 'English',
      value: 'english'
    }
  ]
};

const dynamicField = {
  id: 'Select_1',
  key: 'language',
  label: 'Language',
  type: 'select',
  valuesKey: 'dynamicValues'
};

const dynamicFieldInitialData = {
  dynamicValues: [
    {
      label: 'Dynamic Value 1',
      value: 'dynamicValue1'
    },
    {
      label: 'Dynamic Value 2',
      value: 'dynamicValue2'
    }
  ]
};

function createSelect(options = {}) {
  const {
    disabled,
    errors,
    field = defaultField,
    onChange,
    path = [ defaultField.key ],
    value
  } = options;

  return render(WithFormContext(
    <Select
      disabled={ disabled }
      errors={ errors }
      field={ field }
      onChange={ onChange }
      path={ path }
      value={ value } />,
    options
  ), {
    container: options.container || container.querySelector('.fjs-form')
  });
}