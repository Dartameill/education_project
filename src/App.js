import React, { useState, useEffect, useRef } from 'react';
import './App.css';

const DynamicTable = () => {
  const [columns, setColumns] = useState([]); // Список столбцов
  const [data, setData] = useState({}); // Данные таблицы
  const [isModified, setIsModified] = useState(false); // Флаг, указывающий на наличие изменений
  const [dropdownVisible, setDropdownVisible] = useState(false); // Флаг видимости дропдауна
  const [selectedItem, setSelectedItem] = useState(''); // Выбранный элемент из дропдауна

  const initialColumnNames = [
    'action',
    'global_action',
    'paid',
    'organic',
    'price',
    'cpc',
    'job_board_id',
    'job_reference',
    'device',
    'created_at',
    'exchange_id',
    'gcc'
  ];

  const columnNames = {
    action: 'Action',
    global_action: 'Global Action',
    paid: 'Paid',
    organic: 'Organic',
    price: 'Price',
    cpc: 'CPC',
    job_board_id: 'Job Board ID',
    job_reference: 'Job Reference',
    device: 'Device',
    created_at: 'Created At',
    exchange_id: 'Exchange ID',
    gcc: 'GCC',
    test: 'test1',
    test1: 'test2',
    test2: 'test3',
    test3: 'test4',
    test3: 'test4'
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    setColumns(initialColumnNames);
    const initialData = initialColumnNames.reduce((acc, columnName) => ({ ...acc, [columnName]: [] }), {});
    setData(initialData);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownVisible(false);
        setSelectedItem('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Функция для добавления нового столбца
  const addColumn = () => {
    if (Object.keys(columnNames).length === columns.length) {
      alert('Нет доступных элементов для выбора.');
      return;
    }
    setDropdownVisible(true);
  };

  // Функция для выбора элемента из дропдауна и добавления его в столбцы
  const selectItem = (item) => {
    if (item === '') {
      alert('Название столбца не может быть пустым');
      return;
    }
    if (columns.includes(item)) {
      alert('Столбец уже существует');
      return;
    }

    setColumns((prevColumns) => [...prevColumns, item]);
    setData((prevData) => ({
      ...prevData,
      [item]: [],
    }));
    setIsModified(true); // Установка флага изменений

    setDropdownVisible(false);
    setSelectedItem('');
  };

  // Функция для удаления столбца
  const removeColumn = (column) => {
    if (initialColumnNames.includes(column)) {
      alert(`"${column}" не может быть удален.`);
      return;
    }

    setColumns((prevColumns) => prevColumns.filter((col) => col !== column));
    setData((prevData) => {
      const newData = { ...prevData };
      delete newData[column];
      return newData;
    });
    setIsModified(true); // Установка флага изменений
  };

  // Функция для добавления новой строки с данными для указанного столбца
  const addRow = (column) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData[column] = [...newData[column], ''];
      return newData;
    });
    setIsModified(true); // Установка флага изменений
  };

  // Функция для удаления значения в указанной строке и столбце
  const removeValue = (column, rowIndex) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData[column] = newData[column].filter((_, index) => index !== rowIndex);
      return newData;
    });
    setIsModified(true); // Установка флага изменений
  };

  // Функция для редактирования значения в указанной строке и столбце
  const editValue = (column, rowIndex, newValue) => {
    setData((prevData) => {
      const newData = { ...prevData };
      newData[column][rowIndex] = newValue;
      return newData;
    });
    setIsModified(true); // Установка флага изменений
  };

  const hasEmptyRow = () => {
    return Object.values(data).some((columnValues) => columnValues.some((value) => value === ''));
  };

  // Функция для удаления пустых строк
const removeEmptyRows = () => {
  setData((prevData) => {
    const newData = { ...prevData };

    // Создаем массив индексов строк, которые нужно удалить
    const rowsToDelete = [];

    // Перебираем каждую строку
    const rowIndices = Object.keys(newData[columns[0]]);
    rowIndices.forEach((rowIndex) => {
      let isRowEmpty = true;

      // Проверяем значения в каждом столбце строки
      columns.forEach((column) => {
        const value = newData[column][rowIndex];

        if (value !== undefined && value.trim() !== '') {
          isRowEmpty = false;
          return;
        }
      });

      // Если строка пустая, добавляем ее индекс в массив rowsToDelete
      if (isRowEmpty) {
        rowsToDelete.push(rowIndex);
      }
    });

    // Удаляем строки из каждого столбца в обратном порядке
    Object.keys(newData).forEach((column) => {
      rowsToDelete.sort((a, b) => b - a).forEach((rowIndex) => {
        newData[column].splice(rowIndex, 1);
      });
    });

    return newData;
  });

  setIsModified(true); // Установка флага изменений
};

  // Обработчик события beforeunload
  const handleBeforeUnload = (event) => {
    if (isModified) {
      event.preventDefault();
      event.returnValue = '';
    }
  };

  // Добавление обработчика события beforeunload при монтировании компонента
  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isModified]);

  // Функция для открытия модального окна с редактированием значения
  const openModal = (column, rowIndex) => {
    const value = data[column][rowIndex];
    const newValue = prompt(
      `Введите новое значение для столбца "${columnNames[column]}" и строки ${rowIndex + 1}`,
      value
    );
    if (newValue === null) {
      alert('Значение не было изменено');
      return;
    }
    editValue(column, rowIndex, newValue);
  };

    //логика кнопки "Отправить Данные"
const handleSendData = () => {
  if (Object.keys(data).length === 0 || Object.values(data).every((column) => column.length === 0)) {
    alert('Нельзя отправлять пустой массив данных.');
    return;
  }

  const payload = {
    columns: columns.map((column) => columnNames[column]),
    data: data,
  };

  // Здесь вызывайте ваш API-эндпоинт и передавайте payload

  console.log(payload); // Вместо console.log отправьте данные на ваш API-эндпоинт
};

  // Фильтрация недобавленных столбцов для отображения в дропдауне
  const availableColumns = Object.keys(columnNames).filter((column) => !columns.includes(column));

  return (
    <div>
    <button className="add-record" onClick={() => addRow(columns[0])}>
                        Добавить строку
                      </button>
      <button
        className={`add-column ${Object.keys(columnNames).length === columns.length ? 'disabled' : ''}`}
        onClick={addColumn}
        disabled={Object.keys(columnNames).length === columns.length}
      >
        Добавить столбец
      </button>
      {dropdownVisible && availableColumns.length > 0 && (
        <div className="popup" ref={dropdownRef}>
          <ul className="popup-content">
            {availableColumns.map((column) => (
              <li key={column} onClick={() => selectItem(column)}>
                {columnNames[column]}
              </li>
            ))}
          </ul>
        </div>
      )}
      {dropdownVisible && availableColumns.length === 0 && (
        <div>
          <button className="add-column" onClick={() => alert('Нет доступных элементов для выбора.')}>
            Добавить столбец
          </button>
        </div>
      )}
      <button className="remove-empty-rows" onClick={removeEmptyRows}>
        Удалить пустые строки
      </button>
      <table className="dynamic-table">
        <thead>
          <tr>
            {columns.map((column, index) => (
              <th className="columnNamesInTable" key={index}>
                {columnNames[column]}
                <span className="remove-column" onClick={() => removeColumn(column)}>
                  &#10006;
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Object.keys(data).length > 0 &&
            Array.from({ length: Math.max(...Object.values(data).map((values) => values.length)) }).map((_, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((column, colIndex) => (
                  <td key={colIndex} style={{ wordWrap: 'break-word' }}>
                    {rowIndex < data[column].length ? (
                      <input
                        type="text"
                        value={data[column][rowIndex]}
                        onChange={(e) => editValue(column, rowIndex, e.target.value)}
                      />
                    ) : (
                      <input
                        type="text"
                        value=""
                        onChange={(e) => editValue(column, rowIndex, e.target.value)}
                      />
                    )}
                    {data[column][rowIndex] && (
                      <span className="remove-value" onClick={() => removeValue(column, rowIndex)}>
                        &#10006;
                      </span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
        </tbody>
      </table>
      <button className="sendToEndpoint" onClick={handleSendData}>
        Отправить данные
      </button>
    </div>
  );

};

export default DynamicTable;