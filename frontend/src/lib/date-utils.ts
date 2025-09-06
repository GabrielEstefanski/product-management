/**
 * Utilitários para formatação e manipulação de datas
 */

/**
 * Formata uma data para o padrão brasileiro (dd/mm/aaaa)
 * @param date - Data a ser formatada (string, Date ou timestamp)
 * @returns String formatada no padrão brasileiro
 */
export const formatDateBR = (date: string | Date | number): string => {
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }

    return dateObj.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return 'Data inválida';
  }
};

/**
 * Formata uma data para o padrão brasileiro com hora (dd/mm/aaaa hh:mm)
 * @param date - Data a ser formatada (string, Date ou timestamp)
 * @returns String formatada no padrão brasileiro com hora
 */
export const formatDateTimeBR = (date: string | Date | number): string => {
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }

    return dateObj.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Data inválida';
  }
};

/**
 * Formata uma data para exibição relativa (ex: "há 2 dias", "ontem", "hoje")
 * @param date - Data a ser formatada (string, Date ou timestamp)
 * @returns String formatada de forma relativa
 */
export const formatRelativeDate = (date: string | Date | number): string => {
  try {
    const dateObj = new Date(date);
    
    if (isNaN(dateObj.getTime())) {
      return 'Data inválida';
    }

    const now = new Date();
    const diffInMs = now.getTime() - dateObj.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) {
      return 'Hoje';
    } else if (diffInDays === 1) {
      return 'Ontem';
    } else if (diffInDays < 7) {
      return `Há ${diffInDays} dias`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `Há ${weeks} semana${weeks > 1 ? 's' : ''}`;
    } else if (diffInDays < 365) {
      const months = Math.floor(diffInDays / 30);
      return `Há ${months} mês${months > 1 ? 'es' : ''}`;
    } else {
      const years = Math.floor(diffInDays / 365);
      return `Há ${years} ano${years > 1 ? 's' : ''}`;
    }
  } catch (error) {
    return 'Data inválida';
  }
};

/**
 * Verifica se uma data é válida
 * @param date - Data a ser verificada
 * @returns true se a data é válida, false caso contrário
 */
export const isValidDate = (date: string | Date | number): boolean => {
  try {
    const dateObj = new Date(date);
    return !isNaN(dateObj.getTime());
  } catch (error) {
    return false;
  }
};

/**
 * Converte uma string de data para Date object
 * @param dateString - String da data
 * @returns Date object ou null se inválida
 */
export const parseDate = (dateString: string): Date | null => {
  try {
    const date = new Date(dateString);
    return isValidDate(date) ? date : null;
  } catch (error) {
    return null;
  }
};

