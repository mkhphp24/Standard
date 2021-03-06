<?php

    /*
     * (c) MajPanel <https://github.com/MajPanel/>
     *
     * For the full copyright and license information, please view the LICENSE
     * file that was distributed with this source code.
     */


	namespace App\Form\MajPanel\Book;

	use App\Form\MajPanel\AbstractValidate;
	use Symfony\Component\Validator\Constraints as Assert;

    /**
     * @author Majid Kazerooni <support@majpanel.com>
     */

	class InsertFormValidateBook extends AbstractValidate
	{

		/**
		 * @return array
		 */
		public function validateCheck(): array
		{
			$groups     = new Assert\GroupSequence(['Default', 'custom']);
			$constraint = new Assert\Collection([
			 'name' => [new Assert\NotBlank()]
				,  'autor' => [new Assert\NotBlank()]
				,  'publisher' => [new Assert\NotBlank()]
				
			]);

			return $this->setValidate($constraint, $groups);
		}

	}
