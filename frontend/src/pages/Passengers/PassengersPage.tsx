import { Button } from '@consta/uikit/Button';
import { Modal } from '@consta/uikit/Modal';
import { Table } from '@consta/uikit/Table';
import { Text } from '@consta/uikit/Text';
import { TextField } from '@consta/uikit/TextField';
import { useCallback, useEffect, useState } from 'react';

import {
  useCreatePassengerMutation,
  useDeletePassengerMutation,
  useGetPassengersQuery,
  useUpdatePassengerMutation,
} from '../../api/passengersApi';
import type { Passenger } from '../../shared/types/Passengers';
import styles from './PassengersPage.module.scss';

// TODO вынести в отдельные модули
const CreatePassengerFiled = {
  Name: 'name',
  Phone: 'phone',
  Email: 'email',
} as const;

const DEFAULT_CREATE_FORM = {
  [CreatePassengerFiled.Name]: '',
  [CreatePassengerFiled.Phone]: '',
  [CreatePassengerFiled.Email]: '',
};

export const PassengersPage = () => {
  const { data, isLoading, isError } = useGetPassengersQuery();
  const [createPassenger, { isLoading: isCreating }] =
    useCreatePassengerMutation();
  const [updatePassenger, { isLoading: isUpdating }] =
    useUpdatePassengerMutation();
  const [deletePassenger, { isLoading: isDeleting }] =
    useDeletePassengerMutation();

  const [createPassengerData, setCreatePassengerData] =
    useState(DEFAULT_CREATE_FORM);

  const [editOpen, setEditOpen] = useState(false);

  // TODO переделать как с createPassengerData
  const [editId, setEditId] = useState('');
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');
  const [editEmail, setEditEmail] = useState('');

  const isCreateDisabled =
    isCreating ||
    !createPassengerData.name ||
    !createPassengerData.phone ||
    !createPassengerData.email;

  const handleSetCreateData = (
    field: (typeof CreatePassengerFiled)[keyof typeof CreatePassengerFiled],
    value: string,
  ) => {
    setCreatePassengerData((prev) => {
      console.log('prev', prev);
      return { ...prev, [field]: value };
    });
  };

  const handleCreate = useCallback(async () => {
    const { name, phone, email } = createPassengerData;

    if (!name || !phone || !email) return;

    const newId = crypto.randomUUID().slice(0, 12);

    try {
      await createPassenger({
        id: newId,
        name,
        phone,
        email,
      }).unwrap();

      setCreatePassengerData(DEFAULT_CREATE_FORM);

      // setName('');
      // setPhone('');
      // setEmail('');
    } catch (err) {
      console.error('Error creating passenger', err);
    }
  }, [createPassenger, createPassengerData]);

  const openEdit = (passenger: Passenger) => {
    setEditId(passenger.id);
    setEditName(passenger.name);
    setEditPhone(passenger.phone);
    setEditEmail(passenger.email);
    setEditOpen(true);
  };

  const handleUpdate = useCallback(async () => {
    try {
      await updatePassenger({
        id: editId,
        name: editName,
        phone: editPhone,
        email: editEmail,
      }).unwrap();

      setEditOpen(false);
    } catch (err) {
      console.error('Error updating passenger', err);
    }
  }, [editEmail, editId, editName, editPhone, updatePassenger]);

  const handleDelete = async (id: string) => {
    try {
      await deletePassenger(id).unwrap();
    } catch (err) {
      console.error('Error deleting', err);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Enter') {
        return;
      }

      if (editOpen) {
        if (isUpdating) {
          return;
        }

        if (!editName || !editPhone || !editEmail) {
          return;
        }

        handleUpdate();
        return;
      }

      if (isCreating) {
        return;
      }

      const { name, phone, email } = createPassengerData;

      if (!name || !phone || !email) {
        return;
      }

      handleCreate();
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isCreating,
    handleCreate,
    editOpen,
    isUpdating,
    editName,
    editPhone,
    editEmail,
    handleUpdate,
    createPassengerData,
  ]);

  // TODO: декомпозировать
  return (
    <div className={styles.root}>
      <Text size="xl" weight="bold">
        Административная панель пассажиров
      </Text>
      {/* // TODO убрать диблирование */}
      {!isLoading && !isError && (
        <Text size="s" view="secondary">
          Создание, редактирование и удаление пассажиров
        </Text>
      )}

      {isLoading && <div className={styles.loading}>ProgressSpin</div>}

      {isError && (
        <div className={styles.error}>
          <Text size="xl" weight="bold">
            Error loading Passengers
          </Text>
        </div>
      )}

      {!isLoading && !isError && (
        <div>
          <div className={styles.form}>
            <TextField
              id={CreatePassengerFiled.Name}
              placeholder="Имя"
              value={createPassengerData[CreatePassengerFiled.Name]}
              onChange={(value) =>
                handleSetCreateData(CreatePassengerFiled.Name, value ?? '')
              }
              style={{ width: 200 }}
            />
            <TextField
              id={CreatePassengerFiled.Phone}
              placeholder="Телефон"
              value={createPassengerData[CreatePassengerFiled.Phone]}
              onChange={(value) =>
                handleSetCreateData(CreatePassengerFiled.Phone, value ?? '')
              }
              style={{ width: 200 }}
            />
            <TextField
              id={CreatePassengerFiled.Email}
              placeholder="Email"
              value={createPassengerData[CreatePassengerFiled.Email]}
              onChange={(value) =>
                handleSetCreateData(CreatePassengerFiled.Email, value ?? '')
              }
              style={{ width: 200 }}
            />

            <Button
              label="Создать"
              view="primary"
              onClick={handleCreate}
              loading={isCreating}
              disabled={isCreateDisabled}
            />
          </div>

          <div className={styles.table}>
            <Table<Passenger & { actions: never }>
              stickyHeader
              columns={[
                { title: 'ID', accessor: 'id' },
                { title: 'Имя', accessor: 'name' },
                { title: 'Телефон', accessor: 'phone' },
                { title: 'Email', accessor: 'email' },
                {
                  title: 'Действия',
                  accessor: 'actions',
                  renderCell: (row) => (
                    <div className={styles.actionsCell}>
                      <Button
                        size="xs"
                        view="primary"
                        label="Редактировать"
                        onClick={() => openEdit(row)}
                        loading={isUpdating}
                      />
                      <Button
                        size="xs"
                        view="secondary"
                        label="Удалить"
                        onClick={() => handleDelete(row.id)}
                        loading={isDeleting}
                      />
                    </div>
                  ),
                },
              ]}
              rows={(data ?? []) as Array<Passenger & { actions: never }>}
            />
          </div>
        </div>
      )}

      <Modal isOpen={editOpen} onClickOutside={() => setEditOpen(false)}>
        <div
          style={{
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
          }}
        >
          <TextField
            label="Имя"
            value={editName}
            onChange={(value) => setEditName(value ?? '')}
          />
          <TextField
            label="Телефон"
            value={editPhone}
            onChange={(value) => setEditPhone(value ?? '')}
          />
          <TextField
            label="Email"
            value={editEmail}
            onChange={(value) => setEditEmail(value ?? '')}
          />

          <Button
            label="Сохранить"
            view="primary"
            onClick={handleUpdate}
            disabled={isUpdating}
          />
        </div>
      </Modal>
    </div>
  );
};
