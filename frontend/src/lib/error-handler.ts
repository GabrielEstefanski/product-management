export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

export interface ErrorMapping {
  statusCode: number;
  defaultMessage: string;
  customMessages?: Record<string, string>;
}

const ERROR_MAPPINGS: Record<string, ErrorMapping> = {
  '400': {
    statusCode: 400,
    defaultMessage: 'Dados inválidos. Verifique as informações e tente novamente.',
    customMessages: {
      'BadRequestException': 'Os dados enviados não são válidos. Verifique as informações e tente novamente.',
      'DomainException': 'Erro de validação. Verifique os dados e tente novamente.',
    }
  },
  
  '404': {
    statusCode: 404,
    defaultMessage: 'Recurso não encontrado.',
    customMessages: {
      'NotFoundException': 'O item solicitado não foi encontrado.',
    }
  },
  
  '500': {
    statusCode: 500,
    defaultMessage: 'Erro interno do servidor. Tente novamente em alguns instantes.',
  },
  
  'NETWORK_ERROR': {
    statusCode: 0,
    defaultMessage: 'Erro de conexão. Verifique sua internet e tente novamente.',
  },
  
  'TIMEOUT': {
    statusCode: 0,
    defaultMessage: 'A operação demorou muito para ser concluída. Tente novamente.',
  },
};

export class ErrorHandler {
  static processError(error: any): string {
    if (typeof error === 'string') {
      return error;
    }

    if (this.isNetworkError(error)) {
      return ERROR_MAPPINGS.NETWORK_ERROR.defaultMessage;
    }

    if (this.isTimeoutError(error)) {
      return ERROR_MAPPINGS.TIMEOUT.defaultMessage;
    }

    if (this.isApiError(error)) {
      return this.getApiErrorMessage(error);
    }

    return this.getGenericErrorMessage(error);
  }

  private static isNetworkError(error: any): boolean {
    return (
      error?.code === 'NETWORK_ERROR' ||
      error?.message?.includes('Network Error') ||
      error?.message?.includes('fetch') ||
      !navigator.onLine
    );
  }

  private static isTimeoutError(error: any): boolean {
    return (
      error?.code === 'TIMEOUT' ||
      error?.message?.includes('timeout') ||
      error?.message?.includes('TIMEOUT')
    );
  }

  private static isApiError(error: any): boolean {
    return (
      error?.response?.status ||
      error?.status ||
      error?.statusCode ||
      (error?.message && typeof error.message === 'string')
    );
  }

  private static getApiErrorMessage(error: any): string {
    const statusCode = this.extractStatusCode(error);
    const errorType = this.extractErrorType(error);
    
    const mapping = ERROR_MAPPINGS[statusCode.toString()];
    
    if (!mapping) {
      return this.getGenericErrorMessage(error);
    }

    if (errorType && mapping.customMessages?.[errorType]) {
      return mapping.customMessages[errorType];
    }

    if (mapping.defaultMessage) {
      return mapping.defaultMessage;
    }

    return this.getGenericErrorMessage(error);
  }

  private static extractStatusCode(error: any): number {
    return (
      error?.response?.status ||
      error?.status ||
      error?.statusCode ||
      500
    );
  }

  private static extractErrorType(error: any): string | null {
    const message = error?.response?.data?.message || error?.message || '';
    
    const exceptionPatterns = [
      /NotFoundException/i,
      /BadRequestException/i,
      /DomainException/i,
      /AppException/i,
    ];

    for (const pattern of exceptionPatterns) {
      const match = message.match(pattern);
      if (match) {
        return match[0];
      }
    }

    return null;
  }

  private static getGenericErrorMessage(error: any): string {
    if (error?.message && typeof error.message === 'string') {
      if (this.isTechnicalMessage(error.message)) {
        return 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.';
      }
      return error.message;
    }

    return 'Ocorreu um erro inesperado. Tente novamente em alguns instantes.';
  }

  private static isTechnicalMessage(message: string): boolean {
    const technicalTerms = [
      'exception',
      'error',
      'failed',
      'undefined',
      'null',
      'stack trace',
      'at ',
      'caused by',
      'system',
      'internal',
    ];

    const lowerMessage = message.toLowerCase();
    return technicalTerms.some(term => lowerMessage.includes(term));
  }

  static addErrorMapping(key: string, mapping: ErrorMapping): void {
    ERROR_MAPPINGS[key] = mapping;
  }

  static getErrorMappings(): Record<string, ErrorMapping> {
    return { ...ERROR_MAPPINGS };
  }
}

export const useErrorHandler = () => {
  const handleError = (error: any): string => {
    return ErrorHandler.processError(error);
  };

  const handleAsyncError = async (asyncFn: () => Promise<any>): Promise<any> => {
    try {
      return await asyncFn();
    } catch (error) {
      throw new Error(ErrorHandler.processError(error));
    }
  };

  return {
    handleError,
    handleAsyncError,
  };
};
