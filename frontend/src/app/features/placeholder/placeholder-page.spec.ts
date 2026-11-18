import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { PlaceholderPage } from './placeholder-page';

describe('PlaceholderPage', () => {
  it('shows destination-specific unavailable content and a Home link', () => {
    TestBed.configureTestingModule({
      imports: [PlaceholderPage],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              data: {
                title: 'Criar Projeto indisponível',
                description: 'A criação de projetos ainda não está disponível.',
              },
            },
          },
        },
      ],
    });

    const fixture = TestBed.createComponent(PlaceholderPage);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('h1')?.textContent).toContain(
      'Criar Projeto indisponível',
    );
    expect(compiled.querySelector('.back-link')?.getAttribute('href')).toBe('/');
  });
});
