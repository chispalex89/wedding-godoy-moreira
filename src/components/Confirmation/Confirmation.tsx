import React, { FC, useEffect, useState } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useSearchParams } from 'react-router-dom';

import {
  ConfirmationBorderBottomLeftImage,
  ConfirmationBorderBottomRightImage,
  ConfirmationBorderTopLeftImage,
  ConfirmationBorderTopRightImage,
  ConfirmationButton,
  ConfirmationContainer,
  ConfirmationImage,
  ConfirmationLogo,
  ConfirmationMessage,
  ConfirmationPikachuImage,
  ConfirmationTitle,
  ConfirmationWrapper,
} from './Confirmation.styled';
import { firestore } from '../../firebase';


import { border7Left, border7Right, border8Left, border8Right, invitation, logo, wedPikachus } from '../../assets/img';
import ConfirmationForm from '../Confirmation-Form/Confirmation-Form';
import { Guest } from '../../interfaces';

interface ConfirmationProps {}

const Confirmation: FC<ConfirmationProps> = () => {
  const [pressed, setPressed] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [searchParams] = useSearchParams();
  const invitationId = searchParams.get('invitationId');
  const [guest, setGuest] = useState<Guest | null>(null);

  useEffect(() => {
    if (invitationId) {
      const fetchGuest = async () => {
        const invitation = await getDoc(
          doc(firestore, 'invitations', invitationId)
        );
        // Here you can fetch the guest data from the server
        if (invitation.exists()) {
          const data = invitation.data();
          setGuest({
            id: invitation.id,
            name: data.name,
            invitedGuests: Number(data.invitedGuests),
            invitedGuestsNames: data.invitedGuestsNames,
          } as Guest);
        }
      };

      fetchGuest();
    }
  }, [invitationId]);

  const handleClick = () => {
    setPressed(true);
    setTimeout(() => {
      setPressed(false);
      setShowForm(true);
    }, 100);
  };

  const handleCancel = () => {
    setShowForm(false);
  }

  const handleFormSubmit = () => {
    setShowForm(false);
    setShowThankYou(true);
  }
  return (
    <ConfirmationWrapper>
      <ConfirmationContainer>
        <ConfirmationBorderTopLeftImage src={border7Left} />
        <ConfirmationBorderTopRightImage src={border7Right} />
        <ConfirmationImage src={invitation} />
        <ConfirmationMessage>
          Nos encantaría verte en nuestra boda y crear juntos recuerdos
          inolvidables. Queremos que disfrutes de esta celebración tanto como
          nosotros, por eso hemos decidido no incluir a niños.
        </ConfirmationMessage>
        <ConfirmationTitle>¡Confirma tu asistencia!</ConfirmationTitle>
        <ConfirmationMessage>
          <small>
            Recuerda que la confirmación de asistencia es importante para que
            podamos planificar con anticipación y así garantizar que todo salga
            a la perfección, pues cada lugar tiene un costo monetario.
            Lastimosamente, si no confirmas tu asistencia antes del 10 de marzo,
            no podremos asegurar tu lugar.
          </small>
        </ConfirmationMessage>
        {!showForm && !showThankYou && guest?.invitedGuests && (
          <ConfirmationMessage>
            <small>Invitados: {guest?.invitedGuests}</small>
          </ConfirmationMessage>
        )}
        {!showForm && !showThankYou && (
          <ConfirmationButton onClick={handleClick} pressed={pressed}>
            Confirma aquí
          </ConfirmationButton>
        )}
        {showForm && (
          <ConfirmationForm
            onCancel={handleCancel}
            onSubmit={handleFormSubmit}
          />
        )}
        {showThankYou && (
          <ConfirmationTitle>
            <small>
              ¡Gracias por confirmar tu asistencia!
              <br />
              Nos vemos el 6 de abril.
            </small>
          </ConfirmationTitle>
        )}
        <ConfirmationPikachuImage src={wedPikachus} />
        <ConfirmationMessage>
          ¡Gracias por formar parte de este día tan especial!
        </ConfirmationMessage>
        <ConfirmationLogo src={logo} />
        <ConfirmationBorderBottomLeftImage src={border8Left} />
        <ConfirmationBorderBottomRightImage src={border8Right} />
      </ConfirmationContainer>
    </ConfirmationWrapper>
  );
};

export default Confirmation;
